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
        
        let url = this.props.url;
        this.setState({_status: 'loading'},
                      () => {
                          let post = Object.entries(this.state.properties)
                                           .filter(([name]) => name[0] !== '_')
                                           .reduce(reduceEntriesIntoObject, {});
                          axios.post(url, post)
                               .then(({data}) => {
                                   const status    = data.success ? 'success' : 'error';
                                   const _messages = typeof data.message === 'object' ? data.message : {};
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
    
    getPropertyValue(smID) {
        return (this.state.properties[smID] || {}).value || '';
    }
    
    getPropertyMessage(smID) {
        return this.state._messages[smID] || '';
    }
    
    updateValueStatus(smID, value, status = 'okay') {
        const propertyChangeHandler = this.propertyChangeHandler;
        const propertyConfig        = this.getPropertyConfig(smID);
        const newProperties         = this.state.properties;
        propertyChangeHandler(smID, value, propertyConfig);
        return this.setState({
                                 properties: {
                                     ...newProperties,
                                     [smID]: {value, status}
                                 }
                             });
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