import React from "react"
import * as PropTypes from "prop-types"
import bind from "bind-decorator";
import {Factory} from "../../../../../../../../modules/factory/index";
import {DefaultPropertyField} from "./smEntity/default";
import {getTitleFromPropName} from "../../../../../utility";

export default class SchematicField extends React.Component {
    static propTypes = {
        name:                     PropTypes.string.isRequired,
        fieldName:                PropTypes.string.isRequired,
        schematic:                PropTypes.object.isRequired,
        value:                    PropTypes.any,
        message:                  PropTypes.any,
        resolveSmEntitySchematic: PropTypes.func.isRequired,
        resolveSmEntities:        PropTypes.func.isRequired,
        updateValueStatus:        PropTypes.func.isRequired
    };
           state     = {};
    
    render() {
        const componentProps = {
            schematic:                this.props.schematic,
            name:                     this.props.name,
            fieldName:                this.props.fieldName,
            value:                    this.props.value,
            title:                    getTitleFromPropName(this.props.name),
            message:                  this.props.message,
            onValueChange:            this.onValueChange,
            primaryDatatype:          this.props.schematic.datatypes && this.props.schematic.datatypes[0],
            resolveSmEntities:        this.props.resolveSmEntities,
            resolveSmEntitySchematic: this.props.resolveSmEntitySchematic
        };
        const Component      = SchematicField.fieldFactory.Component;
        return <Component {...componentProps} />
    }
    
    @bind
    onValueChange(value, checkPropertyValidity = (schematic, value) => true) {
        const schematic          = this.props.schematic;
        const fieldName          = this.props.fieldName;
        const smID               = schematic.smID;
        const effectiveSchematic = {smID, fieldName, ...schematic};
        const validityStatus     = checkPropertyValidity(effectiveSchematic, value);
        const updateValueStatus  = this.props.updateValueStatus;
        return updateValueStatus(effectiveSchematic, value, validityStatus) || true;
    }
};
SchematicField.fieldFactory = new Factory([props => DefaultPropertyField]);