import React from "react"
import * as PropTypes from "prop-types"
import {normalizeSmID} from "../../dev/modules/sm/utility";
import bind from "bind-decorator";
import axios from "axios";
import {reduceEntriesIntoObject} from "../../../../utility";
import {connect} from "react-redux";
import {SmInputWrapper} from "./input";

@connect(mapState)
class SmEntityCreationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state               = {_status: null};
        const smEntity           = this.props.config;
        const settableProperties = this.getSettablesFromProperties(smEntity.properties || {});
        Object.entries(settableProperties)
              .forEach(([propName, property]) => this.state[propName] = property.defaultValue || '')
    }
    
    @bind
    handleSubmit(event) {
        event.preventDefault();
        
        let url = this.props.url;
        this.setState({_status: 'loading'},
                      () => {
                          let post = Object.entries(this.state)
                                           .filter(([name]) => name[0] !== '_')
                                           .reduce(reduceEntriesIntoObject, {});
                          axios.post(url, post)
                               .then(({data}) => {
                                   const status = data.success ? 'success' : 'error';
                                   this.setState({_status: status});
                                   console.log(data);
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
        
        if (!properties) {
            throw new Error("Can only prompt for SmEntities that have Properties");
        }
        
        let settableProperties = this.getSettablesFromProperties(properties || {});
        let onValueChange      = (propertyName, val) => this.setState({[propertyName]: val});
        return (
            <form onSubmit={this.handleSubmit} className={this.state._status ? 'status__' + this.state._status : ''}>
                {
                    Object.entries(settableProperties)
                          .map(([propertyName, propertyConfig]) => {
                              return <SmInputWrapper key={normalizeSmID(propertyConfig.smID)}
                                                     propertyConfig={propertyConfig}
                                                     propertyName={propertyName}
                                                     value={this.state[propertyName]}
                                                     onValueChange={(propertyName, val) => {
                                                         let propertyChangeHandler = this.props.onPropertyValueChange || function () {};
                                                         propertyChangeHandler(propertyName, val, propertyConfig.smID);
                                                         return onValueChange(propertyName, val);
                                                     }} />
                          })
                }
                <button type="submit">Submit</button>
            </form>
        )
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