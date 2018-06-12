import {getSettablePropertiesFromSmEntity} from "../../../utility";
import {normalizeSchematic}                from "../../../../../utility";
import React                               from "react"
import SchematicField                      from "../schematic";

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

export class PropertyOwnerField extends React.Component {
    static propTypes = {};
    
    getNormalizedSchematic() {
        if (this._normalizedSchematic) return this._normalizedSchematic;
        const schematic     = normalizeSchematic({...(this.props.schematic || {})});
        schematic.fieldName = schematic.fieldName || this.props.fieldName;
        return this._normalizedSchematic = schematic;
    }
    
    getSmEntity() {
        const ownerSmEntity = this.props.value || null;
        const owner         = ownerSmEntity || {};
        owner.properties    = owner.properties || {};
        owner.messages      = owner.messages || {};
        owner.smID          = owner.smID || this.getNormalizedSchematic().smID;
        return owner;
    }
    
    renderPropertyFields() {
        const schematic               = this.getNormalizedSchematic();
        const propertySettables       = getSchematicSettableMap(schematic);
        const settablePropertyEntries = propertySettables.entries();
        const settableProperties      = Array.from(settablePropertyEntries);
        
        const mapPropertySchematicToField = ([name, propertySchematic]) => {
            return this.propertySchematicToField.bind(this)(name, propertySchematic);
        };
        return settableProperties.map(mapPropertySchematicToField);
    }
    
    propertySchematicToField(name, schematic = {}) {
        const ownerSchematic    = this.getNormalizedSchematic();
        const owner             = this.getSmEntity();
        const value             = owner.properties ? owner.properties[name] : null;
        const message           = (owner.messages ? owner.messages[name] : null) || (this.props.message && this.props.messages || {})[name];
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
    
    render() {
        return this.renderPropertyFields();
    }
}