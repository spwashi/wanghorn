import React from "react"
import * as PropTypes from "prop-types"
import {parseSmID} from "../../../../../../dev/modules/sm/utility";

const getPropertyType = function (schematic, type) {
    const {name}                = parseSmID(schematic) || {};
    const propertyIsEmail       = name.toLowerCase().substr(name.length - "email".length) === "email";
    const propertyIsProbablyInt = name.indexOf('_id') > 0 || name === 'id' || (schematic.datatypes || []).indexOf('int') > -1;
    const propertyIsPassword    = (schematic.datatypes || []).indexOf('password') > -1;
    const propertyIsDatetime    = (schematic.datatypes || []).indexOf('datetime') > -1;
    if (propertyIsEmail) type = 'email';
    else if (propertyIsProbablyInt) type = 'number';
    else if (propertyIsPassword) type = 'password';
    else if (propertyIsDatetime) type = 'datetime-local';
    return type;
};

export class PropertyInput extends React.Component {
    render() {
        let {schematic, title, name, value, onValueChange = function () {}} = this.props;
        const type                                                          = getPropertyType(schematic);
        const inputProps                                                    = {value, type};
        const required                                                      = schematic.isRequired;
        
        Object.assign(inputProps, {required, onChange: e => onValueChange(e.target.value)});
        
        if (type === 'email') {
            Object.assign(inputProps,
                          {
                              pattern:   "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$",
                              onKeyDown: e => e.keyCode === 32 ? e.preventDefault() : true,
                              onChange:  e => /[a-zA-Z0-9._%+-@]*$/.test(e.target.value) ? onValueChange(e.target.value) : null
                          });
            value = (value || '').toLowerCase();
        }
        
        inputProps.name        = name;
        inputProps.placeholder = title;
        inputProps.value       = value || '';
        
        return parseInt(schematic.length) >= 750 ? <textarea {...inputProps} />
                                                 : <input {...inputProps} />
    }
}

PropertyInput.propTypes = {
    config:        PropTypes.object,
    value:         PropTypes.any,
    onValueChange: PropTypes.func,
};