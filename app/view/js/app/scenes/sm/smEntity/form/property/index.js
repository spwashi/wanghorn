import React from "react"
import * as PropTypes from "prop-types"
import bind from "bind-decorator";
import {getTitleFromPropName} from "../../../../dev/modules/sm/utility";
import {Factory} from "../../../../../../modules/factory/index";
import {PasswordField, PropertyReferenceField} from "../../../../../components/sm/modify/fields";
import {DefaultPropertyField} from "./field";

const prefixName = function ({prefix, name}) {
    return prefix ? (prefix + '--' + name) : name;
};
export default class PropertyField extends React.Component {
    state = {};
    
    render() {
        const componentProps = {
            schematic:                this.props.schematic,
            name:                     this.props.name,
            value:                    this.props.value,
            title:                    getTitleFromPropName(this.props.name),
            message:                  this.props.message,
            onValueChange:            this.onValueChange,
            primaryDatatype:          this.props.schematic.datatypes && this.props.schematic.datatypes[0],
            resolveSmEntities:        this.props.resolveSmEntities,
            resolveSmEntitySchematic: this.props.resolveSmEntitySchematic
        };
        const Component      = PropertyField.fieldFactory.Component;
        return <Component {...componentProps} />
    }
    
    getPropertyValidityStatus = (identity, value) => true;
    
    @bind
    onValueChange(value, checkPropertyValidity = (schematic, value) => true) {
        const schematic          = this.props.schematic;
        const fieldName          = prefixName({
                                                  prefix: this.props.prefix,
                                                  name:   this.props.name
                                              });
        const smID               = schematic.smID;
        const effectiveSchematic = {smID, fieldName, ...schematic};
        const validityStatus     = checkPropertyValidity(effectiveSchematic, value);
        const updateValueStatus  = this.props.updateValueStatus;
        return updateValueStatus(effectiveSchematic, value, validityStatus) || true;
    }
};
PropertyField.fieldFactory =
    new Factory([
                    props => DefaultPropertyField,
                    ({schematic}) => schematic && schematic.reference ? PropertyReferenceField : null,
                    ({primaryDatatype}) => primaryDatatype === 'password' ? PasswordField : null
                ]);
PropertyField.propTypes    = {
    config:            PropTypes.object,
    updateValueStatus: PropTypes.func,
    
    resolveSmEntitySchematic: PropTypes.func.isRequired,
    resolveSmEntities:        PropTypes.func.isRequired,
    
    value:   PropTypes.any,
    message: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.bool]),
};