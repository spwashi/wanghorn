import React from "react"
import * as PropTypes from "prop-types"
import {PropertyConfigurationAttributeTitle} from "./components/title";
import {PropertyConfigurationAttributeValue} from "./components/value";

export const PropertyConfigurationAttribute =
                 ({value, attribute, children}) =>
                     <div className={`configuration--attribute property--configuration--attribute ${attribute} attribute__${attribute}`}>
                         <PropertyConfigurationAttributeTitle attribute={attribute} />
                         <PropertyConfigurationAttributeValue attribute={attribute} value={value}>
                             {children}
                         </PropertyConfigurationAttributeValue>
                     </div>;
PropertyConfigurationAttribute.propTypes    = {
    attribute: PropTypes.string,
    value:     PropTypes.any,
    children:  PropTypes.any,
};