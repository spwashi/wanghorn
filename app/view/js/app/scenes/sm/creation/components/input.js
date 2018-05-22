import React from "react"
import * as PropTypes from "prop-types"

import {getURI} from "../../../../../path/resolution";
import axios from "axios";
import {getNameFromSmID, normalizeSmID} from "../../../dev/modules/sm/utility";

const getPropertyType = function (propertyConfig, type) {
    const name                  = propertyConfig.name;
    const propertyIsEmail       = name.toLowerCase().substr(name.length - "email".length) === "email";
    const propertyIsProbablyInt = name.indexOf('_id') > 0 || name === 'id' || (propertyConfig.datatypes || []).indexOf('int') > -1;
    const propertyIsPassword    = (propertyConfig.datatypes || []).indexOf('password') > -1;
    const propertyIsDatetime    = (propertyConfig.datatypes || []).indexOf('datetime') > -1;
    if (propertyIsEmail) type = 'email';
    else if (propertyIsProbablyInt) type = 'number';
    else if (propertyIsPassword) type = 'password';
    else if (propertyIsDatetime) type = 'datetime-local';
    return type;
};

class SmEntitySelect extends React.Component {
    state = {data: [], referencedSchematic: null};
    
    componentDidMount() {
        let referencedModelName = getNameFromSmID(this.props.referencedModel);
        
        axios.get(getURI('dev--all_models', {name: referencedModelName}))
             .then(response => {
                 const data = response.data;
            
                 this.setState({data});
            
                 return axios.get(getURI('dev--get_model_schematic',
                                         {name: referencedModelName}))
                             .then(response => {
                                 this.setState({referencedSchematic: response.data})
                             })
             })
    }
    
    render() {
        return (
            <select name={this.props.name}>
                {
                    !this.state.referencedSchematic ? null
                                                    : this.state.data.map(smEntity => {
                                                        const referencedSmID = this.props.referencedProperty;
                                                        console.log(referencedSmID);
                                                        let valueProperty;
                                                        let title;
                        
                                                        Object.entries(smEntity.properties)
                                                              .forEach(
                                                                  ([name, val]) => {
                                                                      let referencedSchematic = this.state.referencedSchematic;
                                                                      let propertySchematic   = referencedSchematic.properties[name];
                                                                      if (/(name|title|text|[a-zA-Z_]+name)/.exec(name)) {
                                                                          title = val;
                                                                      }
                                                                      if (normalizeSmID(propertySchematic.smID) === normalizeSmID(referencedSmID)) {
                                                                          valueProperty = val;
                                                                      }
                                                                  }
                                                              );
                        
                                                        if (typeof valueProperty === "undefined") return null;
                        
                                                        return <option value={JSON.stringify(valueProperty)}>{title || valueProperty}</option>
                                                    })
                }
            </select>
        )
    }
}

SmEntitySelect.propTypes        = {};
export const StandardSmProperty = function ({config, title, value, onValueChange = function () {}}) {
    const type       = getPropertyType(config);
    const inputProps = {
        value,
        type,
        required: config.isRequired,
        onChange: e => onValueChange(e.target.value)
    };
    
    if (config.reference) {
        return <SmEntitySelect referencedProperty={config.reference.hydrationMethod} referencedModel={config.reference.identity}></SmEntitySelect>
    }
    
    switch (type) {
        case 'email':
            inputProps.pattern   = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$";
            inputProps.onKeyDown = event => {
                if (event.keyCode === 32) event.preventDefault();
            };
            inputProps.onChange  = e => {
                let val = e.target.value;
                if (val && !/[a-zA-Z0-9._%+-@]+$/.test(val)) {
                    return;
                }
                onValueChange(val);
            };
            break;
        case 'password':
        case 'number':
        default:
            inputProps.pattern = null;
            break;
    }
    return <input name={config.name} placeholder={title} {...inputProps} />
};
StandardSmProperty.propTypes    = {
    config:        PropTypes.object,
    value:         PropTypes.any,
    onValueChange: PropTypes.func,
};