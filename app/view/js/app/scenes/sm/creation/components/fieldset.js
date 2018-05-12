import React from "react"
import * as PropTypes from "prop-types"

import {normalizeSmID} from "../../../dev/modules/sm/utility";
import {getSettablePropertiesFromSmEntity} from "../utility";
import PropertyField from "../../form/factories/property";

export class PropertyFieldset extends React.Component {
    render() {
        const smEntity           = this.props.smEntityConfig;
        const getPropertyValue   = this.props.getPropertyValue;
        const resolveSmEntity    = this.props.resolveSmEntity || function () {};
        const getPropertyMessage = this.props.getPropertyMessage;
        const updateValueStatus  = this.props.updateValueStatus;
        
        const prefix = this.props.prefix || '';
        
        const settableProperties = getSettablePropertiesFromSmEntity(smEntity);
        const propertyInputs     = Object.entries(settableProperties)
                                         .map(([name, config]) => {
                                             const propertySmID  = normalizeSmID(config.smID);
                                             const prefixed_name = (prefix ? (prefix + '__') : '') + propertySmID;
            
                                             if (((config.datatypes || [])[0] || '').startsWith('[Entity]')) {
                                                 return <PropertyFieldset key={propertySmID}

                                                                          prefix={prefixed_name}

                                                                          getPropertyValue={getPropertyValue}
                                                                          getPropertyMessage={getPropertyMessage}

                                                                          smEntityConfig={resolveSmEntity(config.datatypes[0])}
                                                                          resolveSmEntity={resolveSmEntity}
                                                                          updateValueStatus={updateValueStatus} />
                                             }
            
                                             return <PropertyField key={propertySmID}
            
                                                                   name={prefixed_name}
            
                                                                   config={{...config, name}}
                                                                   value={getPropertyValue(propertySmID)}
                                                                   message={getPropertyMessage(propertySmID)}
                                                                   updateValueStatus={updateValueStatus} />;
                                         });
        return <fieldset name={smEntity.name || smEntity.smID}>{propertyInputs}</fieldset>;
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