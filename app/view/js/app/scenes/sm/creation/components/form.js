import React from "react"
import * as PropTypes from "prop-types"
import bind from "bind-decorator";
import {bindActionCreators} from "redux"
import axios from "axios";
import {reduceEntriesIntoObject} from "../../../../../utility";
import {connect} from "react-redux";
import {PropertyFieldset} from "./fieldset";
import {getSettablePropertiesFromSmEntity} from "../utility";
import {normalizeSmID, parseSmID} from "../../../dev/modules/sm/utility";
import {ApiResponseMessage} from "../../form/response";
import {fetchModels} from "../../../dev/modules/sm/models/actions";
import {PromisedComponent} from "./promisedSchematic";

let mapDispatch = dispatch => bindActionCreators({fetchModels,}, dispatch);
let attempts    = {};

@connect(mapState, mapDispatch)
class SmEntityCreationForm extends React.Component {
    state = {hasSoughtSchematic: null, schematic: null};
    
    constructor(props) {
        super(props);
        this.state = {
            _status:    null,
            properties: {},
            messages:   {},
            schematic:  this.getSchematic() || null
        };
        this.setInitialPropertyState();
        this.propertyChangeHandler = this.props.onPropertyValueChange || function () {};
    }
    
    componentDidMount() {
        if (this.state.schematic || this.state.hasSoughtSchematic) { return; }
        
        let smEntity          = this.props.smEntity && this.props.smEntity.smID ? this.props.smEntity : null;
        let smID              = this.props.smID;
        let schematic         = this.props.schematic || {};
        let schematicResolved = this.resolveSmEntitySchematic(schematic || smEntity || smID);
        schematic             = (schematicResolved && schematicResolved.smID ? schematicResolved : this.state.schematic);
        
        if (schematic && schematic.smID) smEntity.smID = (smEntity && smEntity.smID) || schematic.smID;
        this.setState({
                          hasSoughtSchematic: true,
                          schematic:          schematic,
                          smEntity
                      }, () => Promise.resolve(schematicResolved))
    }
    
    render() {
        const status    = this.state._status;
        const schematic = this.state.schematic;
        const smEntity  = this.state.smEntity;
        if (!schematic) return schematic === false ? 'Cannot prompt for SmEntityCreation' : 'loading...';
        
        const {properties} = schematic;
        
        if (!properties) {
            console.error(this.state.schematic, this.props.schematic);
            throw new Error("Can only prompt for SmEntities that have Properties");
        }
        
        return (
            <form onSubmit={this.handleSubmit} className={status ? 'status__' + status : ''}>
                <PromisedComponent key={'fields'}
                                   promised={{schematic}}
                                   smEntity={this.state.smEntity || null}
                                   resolveSmEntitySchematic={this.resolveSmEntitySchematic.bind(this)}
                                   resolveSmEntities={this.fetchSmEntities.bind(this)}
                                   getPropertyMessage={this.getPropertyMessage.bind(this)}
                                   getPropertyValue={this.getPropertyValue.bind(this)}
                                   updateValueStatus={this.updateValueStatus.bind(this)}>{PropertyFieldset}</PromisedComponent>
                <div className="message--wrapper">
                    <ApiResponseMessage message={this.state.messages && (this.state.messages._message || this.state.messages[0])} />
                </div>
                <button type="submit">Submit</button>
            </form>
        );
    }
    
    getSchematic() {
        return this.state.schematic || (typeof this.props.schematic === 'object' ? this.props.schematic : null);
    }
    
    setInitialPropertyState() {
        const schematic = this.state.schematic;
        const settables = getSettablePropertiesFromSmEntity(schematic || {});
        const smEntity  = this.props.smEntity;
        Object.entries(settables)
              .forEach(([propName, property]) => {
                  const val                           = typeof smEntity === 'object' ? (smEntity.properties || {})[propName] : null;
                  const propertySmID                  = normalizeSmID(property.smID);
                  this.state.properties[propertySmID] = {value: property.defaultValue || val || ''};
              });
    }
    
    @bind
    handleSubmit(event) {
        event.preventDefault();
        const url              = this.props.url;
        const properties       = this.state.properties;
        const propertyEntries  = Object.entries(properties);
        const submissionErrors = {};
        let canSubmit          = true;
        
        // Check the properties to make sure they are valid
        propertyEntries.forEach(([name, {value, status, message}]) => {
            
            if (typeof status === 'undefined' || (!status && typeof status === 'object')) return;
            
            canSubmit = canSubmit ? !!status : false;
            
            !status && (submissionErrors[name] = message || 'Invalid value');
        });
        
        // Set the error messages on fail
        if (!canSubmit) {
            this.setState({messages: {...this.state.messages, ...submissionErrors}});
            return;
        }
        
        // Otherwise, go through the "loading, success/error" process below
        this.setState({_status: 'loading'},
                      () => {
                          let post = Object.entries(this.state.smEntity || {})
                                           // Ignore underscore properties
                                           .filter(([name]) => name[0] !== '_')
                                           // Check to see if this looks weird?
                                           .map(([name, value]) => [name, value])
                                           //Convert to object
                                           .reduce(reduceEntriesIntoObject, {});
                          axios.post(url, post)
                               .then(({data}) => {
                                   const status   = data.success ? 'success' : 'error';
                                   const _message = status === 'error' ? {message: 'Error Processing Request', success: false}
                                                                       : null;
                                   const messages = typeof data.message === 'object' ? data.message : {_message};
                                   this.setState({_status: status, messages}, i => console.log(this.state));
                               })
                      })
    }
    
    fetchSmEntities({smID}) {
        if (typeof smID !== 'string') throw new Error("Can only find from smID");
        
        if (attempts[smID]) return attempts[smID];
        
        const {manager, name, owner} = parseSmID(smID);
        setTimeout(i => {attempts[smID] = null}, 1000);
        switch (manager) {
            case 'Model':
                return attempts[smID] = this.props
                                            .fetchModels({smID})
                                            .then(({models}) => attempts[smID] = models);
        }
    }
    
    resolveSmEntitySchematic(originalSmEntity) {
        let smEntity = originalSmEntity;
        if (typeof  smEntity === 'object') smEntity = smEntity.smID;
        if (typeof smEntity !== 'string') {
            console.error('Cannot resolve from ', smEntity, originalSmEntity);
            return null;
        }
        
        let contextName                  = this.props.context;
        let {contexts, models, entities} = this.props;
        
        let smID = smEntity;
        let schematic;
        if (contextName && contexts[contextName]) {
            let context = contexts[contextName];
            schematic   = (context.schematics || {})[smID];
        }
        
        let {manager, name, owner} = parseSmID(smID);
        switch (manager) {
            case 'Model':
                schematic = models[smID] || models[normalizeSmID(smID)];
                break;
            case 'Entity':
                schematic = entities[smID] || entities[normalizeSmID(smID)];
                break;
        }
        
        schematic.name = (typeof this.props.smEntity === 'object' && this.props.smEntity ? this.props.smEntity.name : null) || schematic.name;
        
        return schematic ? schematic : null;
    }
    
    getPropertyValue({smID, name}) {
        if (!this.state.smEntity) return null;
        return this.state.smEntity[normalizeSmID(smID)] || this.state.smEntity[name] || null;
    }
    
    getPropertyMessage({smID, name}) {
        return this.state.messages[normalizeSmID(smID)] || this.state.messages[name] || '';
    }
    
    updateValueStatus(effectiveSchematic, value, status = true) {
        const {smID, fieldName, name} = effectiveSchematic;
        
        const propertyChangeHandler = this.propertyChangeHandler;
        const propertyConfig        = this.getPropertyConfig(smID);
        let properties              = this.state.properties;
        let smEntity;
        let message;
        if (typeof status === 'object' && status) {
            message = status.message || null;
            status  = status.status || false;
        }
        propertyChangeHandler(normalizeSmID(smID), value, propertyConfig);
        
        properties = {...properties, [smID]: {value, status, message}};
        
        if (name) {
            smEntity                  = Object.assign({},
                                                      {smID: (this.getSchematic() || {}).smID},
                                                      (this.props.smEntity || {}),
                                                      (this.state.smEntity || {}));
            smEntity.properties       = smEntity.properties || {};
            smEntity.properties[name] = value;
        }
        
        const newState = {properties, smEntity};
        
        if (message || this.state.messages[smID]) {
            newState.messages       = newState.messages || {};
            newState.messages[smID] = message;
        }
        
        return this.setState(newState);
    }
    
    getPropertyConfig(smID) {
        let schematic = this.state.schematic;
        if (!schematic) return null;
        return schematic.properties[smID];
    }
}

SmEntityCreationForm.propTypes = {
    url:                   PropTypes.string.isRequired,
    context:               PropTypes.string,
    smEntity:              PropTypes.object,
    onPropertyValueChange: PropTypes.func,
    smID:                  PropTypes.string,
    schematic:             PropTypes.object
};
export {SmEntityCreationForm};
function mapState(state) {
    let sm                           = state.scenes.sm;
    let {contexts, models, entities} = sm;
    return {contexts, models, entities}
}