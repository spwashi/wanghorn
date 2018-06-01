import React from "react"
import * as PropTypes from "prop-types"
import bind from "bind-decorator";
import {bindActionCreators} from "redux"
import axios from "axios";
import {reduceEntriesIntoObject} from "../../../../../../../utility";
import {connect} from "react-redux";
import {SmEntityFieldset} from "./field/fieldset";
import {normalizeSmID} from "../../../../utility";
import {ApiResponseMessage} from "../../response";
import {fetchModels} from "../../../../modules/models/actions/index";
import {fromSm_selectItemsOfSmID, fromSm_selectSchematicOfSmID} from "../../../../selector";

const mapDispatch             = dispatch => bindActionCreators({fetchModels,}, dispatch);
const getFormSubmissionStatus = function (smEntity) {
    let canSubmit                     = true;
    const {properties, messages = {}} = smEntity;
    const messageEntries              = Object.entries(messages || {});
    // Check the properties to make sure they are valid
    messageEntries.map(entry => {
        const [name, message] = entry;
        if (typeof message === "undefined" || (typeof message === "object" && !message)) return;
        const {status, message: text} = message;
        if (typeof status === 'undefined' || (!status && typeof status === 'object')) {
            text && (messages[name] = text);
            return;
        }
        canSubmit = canSubmit ? !!status : false;
        (messages[name] = text || (!canSubmit ? 'Invalid value' : null));
    });
    
    return {canSubmit, messages};
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
        
        const resolveSmEntities        = item => {
            const smID = typeof item === "object" && item ? item.smID : (typeof  item === 'string' ? item : null);
            
            if (!smID) return;
            console.log(smID);
            return fromSm_selectItemsOfSmID(this.props.sm, {smID});
        };
        const resolveSmEntitySchematic = item => {
            const smID = typeof item === "object" && item ? item.smID : (typeof  item === 'string' ? item : null);
            
            if (!smID) return;
            
            return fromSm_selectSchematicOfSmID(this.props.sm, {smID});
        };
        const _message                 = this.state.messages && (this.state.messages._message || this.state.messages[0]);
        return (
            <form onSubmit={this.handleSubmit} className={status ? 'status__' + status : ''}>
                <SmEntityFieldset schematic={schematic}
                                  messages={this.state.messages}
                                  smEntity={this.state.smEntity}
                                  resolveSmEntities={resolveSmEntities}
                                  updateValueStatus={this.updateValueStatus.bind(this)}
                                  resolveSmEntitySchematic={resolveSmEntitySchematic}>
                </SmEntityFieldset>
                <div className="message--wrapper">
                    <ApiResponseMessage message={_message} />
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
        
        let {canSubmit, messages} = getFormSubmissionStatus(smEntity);
        
        // Set the error messages on fail
        if (!canSubmit) {
            this.setState({
                              messages: {
                                  ...this.state.messages,
                                  ...messages,
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
                                   const status     = data.success || (data.status === true) ? 'success' : 'error';
                                   const _message   = status === 'error' ? {message: 'Error Processing Request', success: false}
                                                                         : null;
                                   const properties = data.properties || {};
                
                                   const messages    = typeof data.message === 'object' ? data.message
                                                                                        : (typeof data.message === 'string' ? {_message: data.message}
                                                                                                                            : {_message});
                                   const newSmEntity = {...this.state.smEntity, messages};
                                   Object.entries(properties)
                                         .forEach(([property_name, property_val]) => {
                                             const smEntityProperty       = (smEntity.properties || {})[property_name];
                                             const {properties, messages} = (smEntityProperty || {});
                    
                                             property_val.messages && Object.assign((smEntityProperty || {}).messages, property_val.messages);
                                         });
                
                                   this.setState({
                                                     _status:  status,
                                                     smEntity: newSmEntity,
                                                     messages: {_message: messages._message || _message},
                                                 }, i => console.log(this.state));
                               })
                      })
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
    let sm = state.scenes.sm;
    return {sm: {...sm}}
}