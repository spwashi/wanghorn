import React from "react"
import * as PropTypes from "prop-types"
import {normalizeSmID, parseSmID} from "../../../dev/modules/sm/utility";
import {getSettablePropertiesFromSmEntity} from "../utility";
import {PromisedComponent} from "./promisedSchematic";
import {PropertySchematicAsField} from "./propertySchematicAsField";
import {PropertyOwnerFieldset} from "./propertyOwnerFieldset";

const SchematicAsField = function ({...props}) {
    let schematic   = props.schematic;
    const name      = schematic.name;
    const {manager} = parseSmID(schematic.smID);
    props.key       = name || schematic.smID;
    
    switch (manager) {
        case 'Model':
        case 'Entity':
            const propertySettables = PropertyFieldset.getSettablePropertyMapFromEntity(schematic);
            
            if (propertySettables.size === 1) {
                schematic = propertySettables.values().next().value;
                schematic = {...schematic || {}, name};
                return <PropertySchematicAsField {...props} />
            }
            
            return <PropertyOwnerFieldset {...props} />;
        
        default:
            return <PropertySchematicAsField {...props} />;
    }
    
};

export class PropertyFieldset extends React.Component {
    getPrefixedSmID(propertySmID) {
        const prefix = this.props.prefix;
        return (prefix ? (prefix + '__') : '') + normalizeSmID(propertySmID);
    }
    
    render() {
        const schematic                  = this.props.schematic;
        const smEntity                   = this.props.smEntity || {};
        const properties                 = smEntity ? smEntity.properties || {} : {};
        const settablePropertySchematics = getSettablePropertiesFromSmEntity(schematic);
        const propertyInputs             =
                  Object.entries(settablePropertySchematics)
                        .map(([name, schematic]) => {
                            schematic.name = schematic.name || name;
                            const props    = this.props;
                            const value    = properties[name] || null;
                
                            if (typeof schematic === "object") {
                                const datatypes       = schematic.datatypes || [];
                                const primaryDatatype = datatypes[0];
                                const parsed          = parseSmID(primaryDatatype) || {};
                                if (parsed.manager === 'Entity' || parsed.manager === 'Model') {
                                    schematic = props.resolveSmEntitySchematic(primaryDatatype);
                                }
                            }
                
                            const prefix = this.getPrefixedSmID(schematic ? schematic.smID
                                                                          : name);
                            return <PromisedComponent key={name}
                                                      {...{...props, value}}
                                                      promised={{schematic}}
                                                      prefix={prefix}
                                                      children={SchematicAsField} />
                        });
        const fieldName                  = schematic.name || schematic.smID;
        return <fieldset name={fieldName}>{propertyInputs}</fieldset>;
    }
    
    static getSettablePropertyMapFromEntity(resolvedPropertySmEntity) {
        const propertySmEntitySettableProperties = getSettablePropertiesFromSmEntity(resolvedPropertySmEntity);
        const subSettableMap                     = new Map(Object.entries(propertySmEntitySettableProperties || {}));
        return subSettableMap;
    }
}

PropertyFieldset.propTypes = {
    // We might want to prefix the names of the properties of this SmEntity to identify where they are from
    prefix:    PropTypes.string,
    // The configuration of the PropertyFieldset's SmEntity
    schematic: PropTypes.object,
    // The value of the SmEntity referenced by this PropertyFieldset
    smEntity:  PropTypes.object,
    
    // A function to retrieve the value of a property in this fieldset
    getPropertyValue:   PropTypes.func,
    // A function to get the message that accompanies a property in this fieldset
    getPropertyMessage: PropTypes.func,
    
    // If we need to reference an SmEntitySchematic, this is a function that will return it or a promise that resolves to it
    resolveSmEntitySchematic: PropTypes.func,
    // A function that will return a Promise which resolves upon the completion of a fetch
    resolveSmEntities:        PropTypes.func,
    
    // A function that allows us to update the value of this SmEntity
    updateValueStatus: PropTypes.func
};