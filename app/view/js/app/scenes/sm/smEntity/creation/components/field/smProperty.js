import React from "react"
import * as PropTypes from "prop-types"
import {parseSmID} from "../../../../../dev/modules/sm/utility";

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

export class StandardSmProperty extends React.Component {
    render() {
        let {schematic, title, name, value, onValueChange = function () {}} = this.props;
        const type                                                          = getPropertyType(schematic);
        const inputProps                                                    = {
            value,
            type,
            required: schematic.isRequired,
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
        return <input name={name}
                      placeholder={title}
                      {...inputProps}
                      value={value || ''} />
    }
}

StandardSmProperty.propTypes = {
    config:        PropTypes.object,
    value:         PropTypes.any,
    onValueChange: PropTypes.func,
};