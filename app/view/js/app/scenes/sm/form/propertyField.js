import React from "react"
import * as PropTypes from "prop-types"
import {getTitleFromPropName} from "../../dev/modules/sm/utility";
import {ApiResponseMessage} from "./response";
import {Factory} from "../../../../modules/factory";
import {PasswordField, PropertyReferenceField} from "../../../components/sm/modify/fields";
import {StandardSmProperty} from "../creation/components/input";
import {Field} from "base-components/form/field/field";

export class DefaultPropertyField extends React.Component {
    render() {
        let input = <StandardSmProperty title={this.props.title}
                                        key={'property'}
                                        name={this.props.name}
                                        value={this.props.value}
                                        onValueChange={this.props.onValueChange}
                                        config={this.props.schematic} />;
        return <Field title={this.props.title}
                      name={this.props.name}
                      message={this.props.message}
                      input={input} />
    }
}

export default class PropertyField extends React.Component {
    state = {};
    
    static fieldFactory = new Factory([
                                          props => DefaultPropertyField,
                                          ({schematic}) => schematic && schematic.reference ? PropertyReferenceField
                                                                                            : null,
                                          ({primaryDatatype}) => primaryDatatype === 'password' ? PasswordField
                                                                                                : null
                                      ]);
    
    render() {
        const {schematic, value, name}                      = this.props;
        const {resolveSmEntitySchematic, resolveSmEntities} = this.props;
        const title                                         = getTitleFromPropName(schematic && schematic.name ? schematic.name : name);
        const onValueChange                                 = this.onValueChange.bind(this);
        const message                                       = this.renderMessage();
        const primaryDatatype                               = schematic.datatypes && schematic.datatypes[0];
        const newProps                                      = {
            schematic,
            value,
            name,
            resolveSmEntities,
            resolveSmEntitySchematic,
            title,
            onValueChange,
            message,
            primaryDatatype
        };
        
        const Component = PropertyField.fieldFactory.Component;
        return <Component {...newProps} />
    }
    
    getPropertyValidityStatus = (identity, value) => true;
    
    onValueChange(value, checkPropertyValidity = (schematic, value) => true) {
        const schematic          = this.props.schematic;
        const fieldName          = this.props.name;
        const smID               = schematic.smID;
        const effectiveSchematic = {smID, fieldName, ...schematic};
        const validityStatus     = checkPropertyValidity(effectiveSchematic, value);
        const updateValueStatus  = this.props.updateValueStatus;
        
        return updateValueStatus(effectiveSchematic, value, validityStatus) || true;
    }
    
    renderMessage() {
        const message = this.props.message;
        return <ApiResponseMessage message={message} />;
    }
};
PropertyField.propTypes = {
    config:            PropTypes.object,
    updateValueStatus: PropTypes.func,
    
    resolveSmEntitySchematic: PropTypes.func.isRequired,
    resolveSmEntities:        PropTypes.func.isRequired,
    
    value:   PropTypes.any,
    message: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};