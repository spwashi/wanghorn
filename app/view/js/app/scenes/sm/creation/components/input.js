import React from "react"
import * as PropTypes from "prop-types"

const getPropertyType           = function (propertyConfig, type) {
    const name                  = propertyConfig.name;
    const propertyIsEmail       = name.toLowerCase().substr(name.length - "email".length) === "email";
    const propertyIsProbablyInt = name.indexOf('_id') > 0 || name === 'id' || (propertyConfig.datatypes || []).indexOf('int') > -1;
    const propertyIsPassword    = (propertyConfig.datatypes || []).indexOf('password') > -1;
    if (propertyIsEmail) type = 'email';
    else if (propertyIsProbablyInt) type = 'number';
    else if (propertyIsPassword) type = 'password';
    return type;
};
export const StandardSmProperty = function ({config, value, onValueChange = function () {}}) {
    const type       = getPropertyType(config);
    const inputProps = {
        value,
        type,
        required: config.isRequired,
        onChange: e => onValueChange(e.target.value)
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
    return <input name={config.name} {...inputProps} />
};
StandardSmProperty.propTypes    = {
    config:        PropTypes.object,
    value:         PropTypes.any,
    onValueChange: PropTypes.func,
};