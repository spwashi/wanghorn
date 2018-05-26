import React from "react"
import * as PropTypes from "prop-types"

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

export class StandardSmProperty extends React.Component {
    render() {
        let {config, title, name, value, onValueChange = function () {}} = this.props;
        
        const type       = getPropertyType(config);
        const inputProps = {
            value,
            type,
            required: config.isRequired,
            onChange: e => {
                let val = e.target.value;
                return onValueChange(val);
            }
        };
        
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
        return <input name={name} placeholder={title} {...inputProps} />
    }
}

StandardSmProperty.propTypes = {
    config:        PropTypes.object,
    value:         PropTypes.any,
    onValueChange: PropTypes.func,
};