import React from "react"
import * as PropTypes from "prop-types"
import {parseSmID} from "../../../../../../utility";
import {getSettablePropertiesFromSmEntity} from "../../../utility";
import SchematicField from "../schematic";

/**
 * Get a Map of the settable properties of an SmEntity
 * @param resolvedPropertySmEntity
 * @return {Map<any, any>}
 */
function getSchematicSettableMap(resolvedPropertySmEntity): Map {
    const propertySmEntitySettableProperties =
              getSettablePropertiesFromSmEntity(resolvedPropertySmEntity);
    const entries                            = Object.entries(propertySmEntitySettableProperties || {});
    return new Map(entries);
}

/**
 * Check to see if an object of messages contains false
 * @param messages
 * @return {boolean}
 */
function checkMessagesForFalse(messages): boolean {
    let status_is_false = false;
    const checkStatus   = message => {
        const typeofMessage = typeof message;
        
        if (status_is_false || typeofMessage === "undefined") return;
        
        if (typeofMessage === "boolean") {
            status_is_false = message;
        } else if (typeofMessage === "object" && message && 'status' in message) {
            status_is_false = typeof message.status !== "undefined" ? !message.status
                                                                    : false;
        }
    };
    Object.entries(messages).map(([name, message]) => checkStatus(message));
    return status_is_false;
}

const prefixName = function ({prefix, name}) {
    return prefix ? (prefix + '--' + name) : name;
};

export class SmEntityField extends React.Component {
    static propTypes            = {
        fieldName: PropTypes.string.isRequired,
        
        value:   PropTypes.any,
        message: PropTypes.any,
        
        resolveSmEntitySchematic: PropTypes.func.isRequired,
        resolveSmEntities:        PropTypes.func.isRequired,
        updateValueStatus:        PropTypes.func.isRequired,
    };
           _normalizedSchematic = null;
    
    render() {
        const schematic    = this.getNormalizedSchematic();
        const {name, smID} = schematic;
        const {manager}    = parseSmID(smID);
        
        if (manager === 'Model' || manager === 'Entity') return this.renderPropertyFields();
        
        return <SchematicField name={name}
                               fieldName={this.props.fieldName || name}
                               schematic={this.getNormalizedSchematic()}
                               value={this.props.value}
                               message={this.props.message}
                               resolveSmEntitySchematic={this.props.resolveSmEntitySchematic}
                               resolveSmEntities={this.props.resolveSmEntities}
                               updateValueStatus={this.props.updateValueStatus} />;
    }
    
    getNormalizedSchematic() {
        if (this._normalizedSchematic) return this._normalizedSchematic;
        
        const schematic     = {...(this.props.schematic || {})};
        const parsed        = parseSmID(schematic) || {};
        const name          = schematic.name ? schematic.name : parsed.name;
        schematic.name      = schematic.name || name;
        schematic.fieldName = schematic.fieldName || this.props.fieldName;
        
        return this._normalizedSchematic = schematic;
    }
    
    renderPropertyFields() {
        const schematic                   = this.getNormalizedSchematic();
        const propertySettables           = getSchematicSettableMap(schematic);
        const settablePropertyEntries     = propertySettables.entries();
        const settableProperties          = Array.from(settablePropertyEntries);
        const mapPropertySchematicToField = ([name, propertySchematic]) => {
            return this.propertySchematicToField.bind(this)(name, propertySchematic);
        };
        return settableProperties.map(mapPropertySchematicToField);
    }
    
    getSmEntity() {
        const ownerSmEntity = this.props.value || null;
        const owner         = ownerSmEntity || {};
        owner.properties    = owner.properties || {};
        owner.messages      = owner.messages || {};
        return owner;
    }
    
    propertySchematicToField(name, schematic = {}) {
        const ownerSchematic    = this.getNormalizedSchematic();
        const owner             = this.getSmEntity();
        const value             = owner.properties ? owner.properties[name] : null;
        const message           = owner.messages ? owner.messages[name] : null;
        const updateValueStatus = this.getPropertyValueStatusUpdateFn(name);
        const fieldName         = prefixName({prefix: ownerSchematic.fieldName, name});
        return <SchematicField key={name}
                               name={name}
                               fieldName={fieldName}
                               prefix={ownerSchematic.name || ownerSchematic.smID}
                               value={value}
                               message={message}
                               resolveSmEntitySchematic={this.props.resolveSmEntitySchematic}
                               resolveSmEntities={this.props.resolveSmEntities}
                               updateValueStatus={updateValueStatus}
                               schematic={schematic} />;
    };
    
    getPropertyValueStatusUpdateFn(propertyName) {
        const ownerSchematic = this.getNormalizedSchematic();
        const owner          = this.getSmEntity();
        return (effectiveSchematic, value, status) => {
            // Set the status and value of this property in
            owner.properties[propertyName] = value;
            owner.messages[propertyName]   = status;
            
            const messages    = owner.messages;
            const ownerStatus = !checkMessagesForFalse(messages);
            const message     = ownerStatus ? null : 'Could not set property';
            const newStatus   = {status: ownerStatus, message};
            
            return this.props.updateValueStatus(ownerSchematic, owner, newStatus);
        };
    }
}