import React from "react"
import * as PropTypes from "prop-types"
import bind from "bind-decorator";
import {bindActionCreators} from "redux"
import axios from "axios";
import {reduceEntriesIntoObject} from "../../../../../../../utility";
import {connect} from "react-redux";
import {SmEntityFieldset} from "./field/fieldset";
import {normalizeSmID, parseSmID} from "../../../../utility";
import {ApiResponseMessage} from "../../response";
import {fetchModels} from "../../../../modules/models/actions/index";
import {PromisedComponent} from "../../../../../../../components/promised/index";

const mapDispatch             = dispatch => bindActionCreators({fetchModels,}, dispatch);
let attempts                  = {};
const getFormSubmissionStatus = function (smEntity) {
    let canSubmit                = true;
    const submissionErrors       = {};
    const {properties, messages} = smEntity;
    const messageEntries         = Object.entries(messages || {});
    // Check the properties to make sure they are valid
    messageEntries.map(entry => {
        const [name, message] = entry;
        if (typeof message === "undefined") return;
        const {status, message: text} = message;
        if (typeof status === 'undefined' || (!status && typeof status === 'object')) {
            return;
        }
        canSubmit = canSubmit ? !!status : false;
        !status && (submissionErrors[name] = text || 'Invalid value');
    });
    
    return {canSubmit, submissionErrors};
};

@connect(mapState, mapDispatch)
class SmEntityCreationForm extends React.Component {
    state = {hasSoughtSchematic: null, schematic: null};
    
    constructor(props) {
        super(props);
        this.state                 = {
            _status:    null,
            properties: {},
            messages:   {},
            schematic:  this.getSchematic() || null
        };
        this.propertyChangeHandler = this.props.onPropertyValueChange || function () {};
    }
    
    componentDidMount() {
        if (this.state.schematic || this.state.hasSoughtSchematic) { return; }
        
        let smEntity          = this.props.smEntity && this.props.smEntity.smID ? this.props.smEntity : {};
        let schematic         = this.props.schematic || {};
        let smID              = (schematic && schematic.smID) || (smEntity && smEntity.smID) || this.props.smID;
        let schematicResolved = this.resolveSmEntitySchematic(smID);
        schematic             = (schematicResolved && schematicResolved.smID ? schematicResolved : this.state.schematic);
        
        if (schematic && schematic.smID) {
            smEntity.smID = (smEntity && smEntity.smID) || schematic.smID;
        }
        
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
                                   resolveSmEntitySchematic={() => {}}
                                   resolveSmEntities={() => {}}
                                   updateValueStatus={this.updateValueStatus.bind(this)}>
                    {SmEntityFieldset}
                </PromisedComponent>
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
    
    @bind
    handleSubmit(event) {
        event.preventDefault();
        const url      = this.props.uri;
        const smEntity = this.state.smEntity || {};
        
        let {canSubmit, submissionErrors} = getFormSubmissionStatus(smEntity);
        
        // Set the error messages on fail
        if (!canSubmit) {
            this.setState({
                              messages: {
                                  ...this.state.messages,
                                  ...submissionErrors,
                                  _message: 'Could not submit form',
                              }
                          });
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
    
    resolveSmEntitySchematic(originalSchematic) {
        let smEntity = originalSchematic;
        if (typeof  smEntity === 'object') smEntity = smEntity.smID;
        if (typeof smEntity !== 'string') {
            console.error('Cannot resolve from ', smEntity, originalSchematic);
            return null;
        }
        
        let schematic;
        let contextName                  = this.props.context;
        let {contexts, models, entities} = this.props;
        let smID                         = smEntity;
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
        
        if (schematic) schematic.name = schematic.name || null;
        
        return schematic ? schematic : null;
    }
    
    updateValueStatus(effectiveSchematic, value, message = true) {
        const {smID, fieldName, name} = effectiveSchematic;
        
        if (typeof message !== 'boolean' && typeof  message !== "object") {
            throw new Error("Expected an object or boolean for message");
        }
        
        const propertyChangeHandler = this.propertyChangeHandler;
        const schematic             = this.getPropertySchematic(smID);
        let smEntity;
        
        propertyChangeHandler(normalizeSmID(smID),
                              value,
                              schematic);
        if (!name) return;
        
        smEntity            = this.getCurrentSmEntity();
        smEntity.properties = smEntity.properties || {};
        smEntity.messages   = smEntity.messages || {};
        
        if (message || smEntity.messages[fieldName]) {
            smEntity.messages            = smEntity.messages || {};
            smEntity.messages[fieldName] = message;
        }
        
        smEntity.properties[name] = value;
        
        return this.setState({smEntity});
    }
    
    getCurrentSmEntity() {
        return Object.assign({},
                             {smID: (this.getSchematic() || {}).smID},
                             (this.props.smEntity || {}),
                             (this.state.smEntity || {}));
    }
    
    getPropertySchematic(smID) {
        let schematic = this.getSchematic();
        if (!schematic) return null;
        return schematic.properties[smID];
    }
}

SmEntityCreationForm.propTypes = {
    uri:                   PropTypes.string.isRequired,
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