import React from "react"
import * as PropTypes from "prop-types"
import {parseSmID} from "../../../../../dev/modules/sm/utility";
import {getSettablePropertiesFromSmEntity} from "../../utility";
import {PromisedComponent} from "../../../../../../../components/promised/index";
import {SchematicField} from "../../modules/smEntity/field";

class SchematicAsField extends React.Component {
    render() {
        const schematic = this.props.schematic;
        const parsed    = parseSmID(schematic);
        const name      = schematic.name ? schematic.name : (parsed || {}).name;
        schematic.name  = schematic.name || name;
        const {manager} = parseSmID(schematic.smID);
        
        if (manager === 'Model' || manager === 'Entity') {
            return this.renderPropertyOwnerFields(schematic);
        }
        
        return <SchematicField key={name || schematic.smID}
                               name={name}
                               {...this.props} />;
        
    }
    
    renderPropertyOwnerFields(schematic) {
        const props             = this.props;
        const ownerSchematic    = schematic;
        const ownerSmEntity     = props.value || null;
        const propertySettables = PropertyFieldset.getSchematicSettableMap(schematic);
        const fields            = [];
        let owner               = ownerSmEntity || {};
        owner.properties        = owner.properties || {};
        owner.messages          = owner.messages || {};
        
        propertySettables.forEach(
            (propertySchematic, propertyName) => {
                const schematic = {...propertySchematic || {}};
                const value     = owner.properties ? owner.properties[propertyName] : null;
                const message   = owner.messages ? owner.messages[propertyName] : null;
                console.log(value, message);
                let updateValueStatus =
                        (effectiveSchematic, value, status) => {
                            owner.properties[propertyName] = value;
                            owner.messages[propertyName]   = status;
                        
                            let status_is_falsey = false;
                        
                            Object.entries(owner.messages)
                                  .forEach(message => {
                                      const typeofMessage = typeof message;
                            
                                      if (status_is_falsey) return;
                            
                                      switch (typeofMessage) {
                                          case "undefined":
                                              return;
                                          case "boolean":
                                              status_is_falsey = message;
                                              return;
                                          case "object":
                                              if (!message) return;
                                              status_is_falsey = message.success;
                                      }
                                  });
                        
                            return props.updateValueStatus(ownerSchematic, owner, {
                                success: !status_is_falsey,
                                message: status_is_falsey ? 'Could not set property' : null
                            });
                        };
                fields.push(<SchematicField key={propertyName}
                                            name={propertyName}
                                            prefix={ownerSchematic.name || ownerSchematic.smID}
                                            value={value}
                                            message={message}
                                            resolveSmEntitySchematic={props.resolveSmEntitySchematic}
                                            resolveSmEntities={props.resolveSmEntities}
                                            updateValueStatus={updateValueStatus}
                                            schematic={schematic} />);
            });
        return fields;
    }
}

export class PropertyFieldset extends React.Component {
    render() {
        const schematic          = this.props.schematic;
        const propertySchematics = getSettablePropertiesFromSmEntity(schematic);
        const propertyInputs     =
                  Object.entries(propertySchematics)
                        .map(
                            ([name, schematic]) => this.mapPropertyToField({schematic, name})
                        );
        const name               = schematic.name || schematic.smID;
        return <fieldset name={name}>{propertyInputs}</fieldset>;
    }
    
    mapPropertyToField({schematic, name}) {
        const smEntity   = this.props.smEntity || {};
        const properties = smEntity ? smEntity.properties || {} : {};
        const messages   = smEntity ? smEntity.messages || {} : {};
        
        schematic.name = schematic.name || name;
        
        const props   = this.props;
        const value   = properties[name] || null;
        const message = messages[name] || null;
        
        if (typeof schematic !== "object") throw new Error("Could not handle schematic");
        
        const datatypes       = schematic.datatypes || [];
        const primaryDatatype = datatypes[0];
        const parsedDatatype  = parseSmID(primaryDatatype) || {};
        
        if (parsedDatatype.manager === 'Entity' || parsedDatatype.manager === 'Model') {
            schematic = props.resolveSmEntitySchematic(primaryDatatype);
        }
        return <PromisedComponent key={name}
                                  {...{...props, value, message}}
                                  promised={{schematic}}
                                  prefix={this.props.prefix}
                                  children={SchematicAsField} />
    }
    
    static getSchematicSettableMap(resolvedPropertySmEntity) {
        const propertySmEntitySettableProperties =
                  getSettablePropertiesFromSmEntity(resolvedPropertySmEntity);
        const entries                            = Object.entries(propertySmEntitySettableProperties || {});
        return new Map(entries);
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