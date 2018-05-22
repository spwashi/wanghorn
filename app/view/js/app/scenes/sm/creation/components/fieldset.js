import React from "react"
import * as PropTypes from "prop-types"

import {normalizeSmID} from "../../../dev/modules/sm/utility";
import {getSettablePropertiesFromSmEntity} from "../utility";
import PropertyField from "../../form/propertyField";

export class PropertyFieldset extends React.Component {
    render() {
        const smEntity           = this.props.smEntityConfig;
        const settableProperties = getSettablePropertiesFromSmEntity(smEntity);
        const propertyInputs     = Object.entries(settableProperties).map(([name, config]) => this.convertToInput(config, name));
        return <fieldset name={smEntity.name || smEntity.smID}>{propertyInputs}</fieldset>;
    }
    
    convertToInput(config, name) {
        const getPropertyValue   = this.props.getPropertyValue;
        const resolveSmEntity    = this.props.resolveSmEntity || function () {};
        const getPropertyMessage = this.props.getPropertyMessage;
        const prefix             = this.props.prefix || '';
        let updateValueStatus    = this.props.updateValueStatus;
        
        const propertySmID  = normalizeSmID(config.smID);
        const prefixed_name = (prefix ? (prefix + '__') : '') + propertySmID;
        
        const isEntity = ((config.datatypes || [])[0] || '').startsWith('[Entity]');
        if (isEntity) {
            const resolvedPropertySmEntity = resolveSmEntity(config.datatypes[0]);
            const subSettables             = getSettablePropertiesFromSmEntity(resolvedPropertySmEntity);
            const subSettableMap           = new Map(Object.entries(subSettables || {}));
            if (subSettableMap.size === 1) {
                const propertyConfig = subSettableMap.values().next().value;
                config               = {...propertyConfig, smID: propertySmID};
            } else {
                return <PropertyFieldset key={propertySmID}
                                         prefix={prefixed_name}
                                         getPropertyValue={getPropertyValue}
                                         getPropertyMessage={getPropertyMessage}
                                         smEntityConfig={resolvedPropertySmEntity}
                                         resolveSmEntity={resolveSmEntity}
                                         updateValueStatus={updateValueStatus} />;
            }
        }
        
        const propertyConfig = {...config, name};
        return <PropertyField key={propertySmID}
                              name={prefixed_name}
                              config={propertyConfig}
                              value={getPropertyValue(propertyConfig)}
                              message={getPropertyMessage(propertyConfig)}
                              updateValueStatus={updateValueStatus} />;
    }
}

PropertyFieldset.propTypes = {
    prefix:         PropTypes.string,
    smEntityConfig: PropTypes.object,
    
    getPropertyValue:   PropTypes.func,
    getPropertyMessage: PropTypes.func,
    resolveSmEntity:    PropTypes.func,
    updateValueStatus:  PropTypes.func
};