import {getTitleFromPropName} from "../../dev/modules/sm/utility";
import React from "react"
import * as PropTypes from "prop-types"

let resolvePropertyInput    = function (name, config, inputProps) {
    let propertyIsEmail       = name.toLowerCase().substr(name.length - "email".length) === "email";
    let propertyIsProbablyInt = name.indexOf('_id') > 0 || name === 'id' || (config.datatypes || []).indexOf('int') > -1;
    let newPropertyProps;
    if (propertyIsEmail) {
        newPropertyProps = {
            ...inputProps,
            type:      'email',
            pattern:   "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$",
            onKeyDown: event => {
                if (event.keyCode === 32) event.preventDefault();
                (inputProps.onKeyDown || function () {})(event);
            },
            onChange:  e => {
                let val = e.target.value;
                if (val && !/[a-zA-Z0-9._%+-@]+$/.test(val)) {
                    return;
                }
                (inputProps.onChange || function () {})(e);
            }
        };
    } else if (config.smID.startsWith('[Property]') && config.smID.endsWith('password')) {
        newPropertyProps = {
            ...inputProps,
            type: 'password'
        };
    } else if (propertyIsProbablyInt) {
        newPropertyProps = {
            ...inputProps,
            type:    'number',
            pattern: null
        };
    } else {
        newPropertyProps = {...inputProps};
    }
    return <input {...newPropertyProps} />
};
export const SmInputWrapper = function ({propertyConfig, propertyName, value, onValueChange}) {
    let propertyProps = {
        pattern:  null,
        type:     'text',
        value:    value || '',
        name:     propertyName,
        onChange: e => {
            let val = e.target.value;
            onValueChange(propertyName, val);
        }
    };
    const inputs      = resolvePropertyInput(propertyName, propertyConfig, propertyProps);
    return (
        <div className={"input--wrapper " + propertyName + '--wrapper'}>
            <label htmlFor={propertyName}>{getTitleFromPropName(propertyName)}</label>
            {inputs}
        </div>
    )
};

SmInputWrapper.propTypes = {
    propertyConfig: PropTypes.object,
    propertyName:   PropTypes.string,
    value:          PropTypes.any,
    onValueChange:  PropTypes.func
};
