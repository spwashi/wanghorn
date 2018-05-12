import React from "react"
import * as PropTypes from "prop-types"
import {normalizeSmID} from "../../dev/modules/sm/utility";
import bind from "bind-decorator";
import axios from "axios";
import {reduceEntriesIntoObject} from "../../../../utility";
import {connect} from "react-redux";
import {resolvePropertyInput, SmInputWrapper} from "./input";

let propertyToInput = function (propertyConfig, onValueChange, value, message) {
    const propertyName   = propertyConfig.name;
    const input          = resolvePropertyInput(propertyName, propertyConfig, {
        value,
        pattern:  null,
        type:     'text',
        name:     propertyName,
        onChange: e => onValueChange(propertyName, e.target.value) || true
    });
    const messageType    = typeof message === 'object' ? (!message.success ? 'error' : 'success') : null;
    const msgText        = typeof message === 'object' ? message.message : message;
    const messageElement = <div className={"message " + (messageType ? (messageType + ' ' + messageType + '--message') : '')}>{msgText}</div>;
    return (
        <SmInputWrapper key={normalizeSmID(propertyConfig.smID)} name={propertyName}>
            {input}
            {messageElement}
        </SmInputWrapper>
    )
};

@connect(mapState)
class SmEntityCreationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state               = {_status: null, properties: {}, _messages: {}};
        const smEntity           = this.props.config;
        const settableProperties = this.getSettablesFromProperties(smEntity.properties || {});
        Object.entries(settableProperties)
              .forEach(([propName, property]) => this.state.properties[propName] = property.defaultValue || '')
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
        let smEntity    = this.props.config;
        let contextName = this.props.context;
        let sm          = this.props.sm;
        if (typeof smEntity === 'string' && contextName && (sm.contexts || {})[contextName]) {
            let context = sm.contexts[contextName];
            smEntity    = (context.schematics || {})[smEntity];
        }
        
        const {properties} = smEntity;
        if (!properties) throw new Error("Can only prompt for SmEntities that have Properties");
        
        let settableProperties = this.getSettablesFromProperties(properties || {});
        let onValueChange      = (propertyName, val) => {
            let propertyChangeHandler = this.props.onPropertyValueChange || function () {};
            const config              = settableProperties[propertyName];
            propertyChangeHandler(propertyName, val, config);
            return this.setState({
                                     properties: {...this.state.properties, [propertyName]: val}
                                 });
        };
        return <form onSubmit={this.handleSubmit} className={this.state._status ? 'status__' + this.state._status : ''}>
            {
                Object.entries(settableProperties)
                      .map(([name, config]) =>
                               propertyToInput({...config, name},
                                               onValueChange,
                                               (this.state.properties[name] || ''),
                                               (this.state._messages[name] || ''))
                      )
            }
            <button type="submit">Submit</button>
        </form>
    }
    
    getSettablesFromProperties(properties) {
        return Object.entries(properties)
                     .filter(([name, prop]) => !prop.isGenerated)
                     .reduce((all, entry) => {
                         const [k, v] = entry;
                         all[k]       = v;
                         return all;
                     }, {});
    }
}

SmEntityCreationForm.propTypes = {
    url:                   PropTypes.string.isRequired,
    context:               PropTypes.string,
    onPropertyValueChange: PropTypes.func,
    config:                PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired
};
export {SmEntityCreationForm};
function mapState(state) {
    let sm = state.scenes.sm;
    return {sm}
}