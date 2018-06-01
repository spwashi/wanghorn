import React from "react"
import * as PropTypes from "prop-types"
import {parseSmID} from "../../../../../utility";
import {getSettablePropertiesFromSmEntity} from "../../utility";
import {PromisedComponent} from "../../../../../../../../components/promised/index";
import {SmEntityField} from "./smEntity/index";

let attempted = [];

export class SmEntityFieldset extends React.Component {
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
        
        const value   = properties[name] || null;
        const message = messages[name] || (this.props.messages || {})[name];
        
        if (typeof schematic !== "object") throw new Error("Could not handle schematic");
        
        const datatypes       = schematic.datatypes || [];
        const primaryDatatype = datatypes[0];
        const parsedDatatype  = parseSmID(primaryDatatype) || {};
        
        if (parsedDatatype.manager === 'Entity' || parsedDatatype.manager === 'Model') {
            schematic = this.props.resolveSmEntitySchematic(primaryDatatype);
        }
        return (
            <PromisedComponent key={name}
                               fieldName={name}
                               value={value}
                               message={message}
                               resolveSmEntitySchematic={this.props.resolveSmEntitySchematic}
                               resolveSmEntities={this.props.resolveSmEntities}
                               updateValueStatus={this.props.updateValueStatus}
                               promised={{schematic}}>{SmEntityField}</PromisedComponent>);
    }
}

SmEntityFieldset.propTypes = {
    // We might want to prefix the names of the properties of this SmEntity to identify where they are from
    prefix:    PropTypes.string,
    // The configuration of the PropertyFieldset's SmEntity
    schematic: PropTypes.object,
    // The value of the SmEntity referenced by this PropertyFieldset
    smEntity:  PropTypes.object,
    
    // If we need to reference an SmEntitySchematic, this is a function that will return it or a promise that resolves to it
    resolveSmEntitySchematic: PropTypes.func,
    // A function that will return a Promise which resolves upon the completion of a fetch
    resolveSmEntities:        PropTypes.func,
    
    // A function that allows us to update the value of this SmEntity
    updateValueStatus: PropTypes.func
};