import React from "react"
import {PromisedComponent} from "../../../../../../../components/promised/index";
import {normalizeSmID, parseSmID} from "../../../../../dev/modules/sm/utility";
import 'react-select/dist/react-select.css';
import {SmEntitySelect} from "./index";

/**
 * Class intended to represent an SmEntity as a <select> input (or something equivalent)
 */
export class PropertyReferenceSelect extends React.Component {
    render() {
        const {onValueChange, resolveSmEntitySchematic} = this.props;
        const propertySchematic                         = this.props.schematic;
        const resolveSmEntities                         = this.props.resolveSmEntities;
        
        const required  = propertySchematic.isRequired;
        const reference = propertySchematic.reference;
        
        let referenceIdentity    = reference.identity;
        let identityPropertySmID = reference.hydrationMethod; // assume that the "hydration method" (what connects these models) is a property
        
        // throw an error of something doesn't loo right
        PropertyReferenceSelect.checkValuePropertySmID(identityPropertySmID);
        
        // If this property is a reference, we want to resolve the schematic of the SmEntity that drives this property's identity
        const inputProps                 = {required};
        const getSmEntityFieldAttributes =
                  (otherSmEntity, schematic) =>
                      PropertyReferenceSelect.getSmEntityFieldAttributes(otherSmEntity, schematic, {valuePropertySmID: identityPropertySmID});
        
        let getResolvedSmEntities        = i => resolveSmEntities({smID: referenceIdentity});
        let getResolvedSmEntitySchematic = i => resolveSmEntitySchematic(referenceIdentity);
        let promised                     = {
            schematic: getResolvedSmEntitySchematic,
            data:      getResolvedSmEntities
        };
        return <PromisedComponent promised={promised}
                                  name={this.props.name}
                                  value={this.props.value}
                                  onValueChange={onValueChange}
                                  inputProps={inputProps}
                                  getSmEntityFieldAttributes={getSmEntityFieldAttributes}
                                  resolveSmEntities={getResolvedSmEntities}>{SmEntitySelect}</PromisedComponent>;
    }
    
    static getSmEntityFieldAttributes(smEntity, schematic, {valuePropertySmID}) {
        let value = null,
            title = null;
        
        Object.entries(smEntity.properties)
              .forEach(
                  ([name, val]) => {
                      let propertySchematic = schematic.properties[name];
                      // if the name of the property contains something that indicates that the name would be the value
                      if (/(name|title|text|[a-zA-Z_]+name)/.exec(name)) title = val;
                
                      // If the property matches the property that we are trying to reference
                      if (normalizeSmID(propertySchematic.smID) === normalizeSmID(valuePropertySmID)) {
                          value = val;
                          title = title || val;
                      }
                  }
              );
        return {value, title};
    }
    
    static checkValuePropertySmID(valuePropertySmID) {
        let {manager: hydrationMethodManager} = parseSmID(valuePropertySmID) || {};
        if (hydrationMethodManager !== 'Property') {
            console.error(valuePropertySmID);
            throw new Error("Can only link SmEntities via Properties");
        }
    }
}