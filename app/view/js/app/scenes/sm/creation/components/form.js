import React from "react"
import * as PropTypes from "prop-types"
import bind from "bind-decorator";
import axios from "axios";
import {reduceEntriesIntoObject} from "../../../../../utility";
import {connect} from "react-redux";
import {PropertyFieldset} from "./fieldset";
import {getSettablePropertiesFromSmEntity} from "../utility";
import {normalizeSmID} from "../../../dev/modules/sm/utility";

@connect(mapState)
class SmEntityCreationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {_status: null, properties: {}, _messages: {}};
        this.setInitialPropertyState();
        this.propertyChangeHandler = this.props.onPropertyValueChange || function () {};
    }
    
    setInitialPropertyState() {
        const config    = this.smEntityConfig;
        const settables = getSettablePropertiesFromSmEntity(config);
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
        propertyEntries.forEach(([name, {value, status, message}]) => {
            if (typeof status === 'undefined' || (!status && typeof status === 'object')) return;
            canSubmit = canSubmit ? !!status : false;
            console.log(message);
            !status && (submissionErrors[name] = message || 'Invalid value');
        });
        console.log(canSubmit);
        if (!canSubmit) {
            this.setState({_messages: {...this.state._messages, ...submissionErrors}});
            return;
        }
        this.setState({_status: 'loading'},
                      () => {
                          let post = propertyEntries.filter(([name]) => name[0] !== '_')
                                                    .reduce(reduceEntriesIntoObject, {});
                          axios.post(url, post)
                               .then(({data}) => {
                                   const status    = data.success ? 'success' : 'error';
                                   const _messages = typeof data.message === 'object' ? data.message : {};
                                   console.log(_messages);
                                   this.setState({_status: status, _messages});
                               })
                      })
    }
    
    render() {
        const status       = this.state._status;
        const {properties} = this.smEntityConfig;
        
        if (!properties) {
            throw new Error("Can only prompt for SmEntities that have Properties");
        }
        
        return (
            <form onSubmit={this.handleSubmit} className={status ? 'status__' + status : ''}>
                {
                    <PropertyFieldset smEntityConfig={this.smEntityConfig}
                    
                                      resolveSmEntity={this.resolveSmEntity.bind(this)}
                    
                                      getPropertyMessage={this.getPropertyMessage.bind(this)}
                                      getPropertyValue={this.getPropertyValue.bind(this)}
                    
                                      updateValueStatus={this.updateValueStatus.bind(this)} />
                }
                <button type="submit">Submit</button>
            </form>
        );
    }
    
    get smEntityConfig() {
        let name_or_config = this.props.config;
        return this.resolveSmEntity(name_or_config);
    }
    
    resolveSmEntity(smEntity) {
        let contextName = this.props.context;
        let sm          = this.props.sm;
        if (typeof smEntity === 'string' && contextName && (sm.contexts || {})[contextName]) {
            let context = sm.contexts[contextName];
            smEntity    = (context.schematics || {})[smEntity];
        }
        return smEntity;
    }
    
    getPropertyValue({smID, name}) {
        return (this.state.properties[normalizeSmID(smID)] || this.state.properties[name] || {}).value || '';
    }
    
    getPropertyMessage({smID, name}) {
        return this.state._messages[normalizeSmID(smID)] || this.state._messages[name] || '';
    }
    
    updateValueStatus(identifier, value, status = true) {
        const propertyChangeHandler = this.propertyChangeHandler;
        const propertyConfig        = this.getPropertyConfig(identifier);
        const newProperties         = this.state.properties;
        let message;
        if (typeof status === 'object' && status) {
            message = status.message || null;
            status  = status.status || false;
        }
        propertyChangeHandler(normalizeSmID(identifier), value, propertyConfig);
        const newState = {
            properties: {
                ...newProperties,
                [identifier]: {value, status}
            }
        };
        if (message || this.state._messages[identifier]) {
            newState._messages             = newState._messages || {};
            newState._messages[identifier] = message;
        }
        return this.setState(newState);
    }
    
    getPropertyConfig(smID) {
        return this.smEntityConfig.properties[smID];
    }
}

SmEntityCreationForm.propTypes = {
    url:                   PropTypes.string.isRequired,
    context:               PropTypes.string,
    smEntity:              PropTypes.object,
    onPropertyValueChange: PropTypes.func,
    config:                PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired
};
export {SmEntityCreationForm};
function mapState(state) {
    let sm = state.scenes.sm;
    return {sm}
}