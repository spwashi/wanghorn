import React from "react"
import * as PropTypes from "prop-types"
import {PromisedComponent} from "./promisedSchematic";
import {normalizeSmID, parseSmID} from "../../../dev/modules/sm/utility";

/**
 * Class intended to represent an SmEntity as a <select> input (or something equivalent)
 */
export class SmEntityPropertyAsSelect extends React.Component {
    render() {
        const {onValueChange, resolveSmEntitySchematic} = this.props;
        const propertySchematic                         = this.props.schematic;
        let resolveSmEntities                           = this.props.resolveSmEntities;
        
        const required  = propertySchematic.isRequired;
        const reference = propertySchematic.reference;
        
        let referenceIdentity    = reference.identity;
        let identityPropertySmID = reference.hydrationMethod; // assume that the "hydration method" (what connects these models) is a property
        
        // throw an error of something doesn't loo right
        SmEntityPropertyAsSelect.checkValuePropertySmID(identityPropertySmID);
        
        // If this property is a reference, we want to resolve the schematic of the SmEntity that drives this property's identity
        const inputProps                 = {required};
        const InlineSmEntity             = ({smEntity}) => {return 'BOON';};
        const getSmEntityFieldAttributes = (otherSmEntity, schematic) => this.getSmEntityFieldAttributes(otherSmEntity, schematic, {valuePropertySmID: identityPropertySmID});
        
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
                                  InlineSmEntity={InlineSmEntity}
                                  getSmEntityFieldAttributes={getSmEntityFieldAttributes}
                                  resolveSmEntities={getResolvedSmEntities}>{SmEntitySelect}</PromisedComponent>;
    }
    
    static checkValuePropertySmID(valuePropertySmID) {
        let {manager: hydrationMethodManager} = parseSmID(valuePropertySmID) || {};
        if (hydrationMethodManager !== 'Property') {
            console.error(valuePropertySmID);
            throw new Error("Can only link SmEntities via Properties");
        }
    }
    
    getSmEntityFieldAttributes(smEntity, schematic, {valuePropertySmID}) {
        let value = null, title = null;
        
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
}

export class SmEntitySelect extends React.Component {
    static propTypes = {
        schematic:                  PropTypes.object,
        data:                       PropTypes.array,
        inputProps:                 PropTypes.object,
        resolveSmEntities:          PropTypes.func.isRequired,
        getSmEntityFieldAttributes: PropTypes.func.isRequired,
    };
           state     = {data: null, referencedSchematic: null};
    
    constructor(props) {
        super(props);
    }
    
    onHasData(data) {
        if (!Array.isArray(data)) { return; }
        
        const isRequired = this.props.inputProps.required;
        console.log(data.length >= 1 && isRequired);
        if (data.length >= 1 && isRequired) {
            let {value} = this.getSmEntityRepresentation(data[0]);
            this.props.onValueChange(value);
        }
    };
    
    componentDidMount() {
        if (this.props.data) {
            this.onHasData(this.props.data);
            return;
        }
        const resolvedSms = this.props.resolveSmEntities();
        Promise.resolve(resolvedSms).then(this.onHasData)
    }
    
    render() {
        const inputProps = this.props.inputProps || {};
        const name       = this.props.name;
        const value      = this.props.value;
        const data       = this.props.data || [];
        const onChange   = e => this.props.onValueChange(e.target.value);
        return (
            <select {...inputProps} name={name} onChange={onChange} value={value}>
                {data.map(smEntity => this.mapSmEntityToOption(smEntity))}
            </select>
        )
    }
    
    getSmEntityRepresentation(smEntity) {return this.props.getSmEntityFieldAttributes(smEntity, this.props.schematic);}
    
    mapSmEntityToOption(smEntity) {
        let {value, title} = this.getSmEntityRepresentation(smEntity);
        value              = JSON.stringify(value);
        
        if (typeof value === "undefined") return null;
        
        return <option key={value} value={value}>{title}</option>
    }
    
}
