import React from "react"
import * as PropTypes from "prop-types"
import AttrValue from "../../attribute/value";

export const PropertyConfigurationAttributeTitle =
                 ({attribute}) =>
                     <h4 className={`attribute--title
                                     configuration--attribute--title
                                     property--configuration--attribute--title
                                     attribute__${attribute}--title`}>{attribute.replace(/([A-Z][a-z])/g, ' $1').trim()}</h4>;
PropertyConfigurationAttributeTitle.propTypes    = {
    attribute: PropTypes.string
};
const PropertyConfigurationAttributeValue        = ({value, attribute}) =>
    <div className={`attribute--value
                     configuration--attribute--value
                     property--configuration--attribute--value
                     attribute__${value}--value`}>
        <AttrValue attr={attribute} value={value} />
    </div>;
PropertyConfigurationAttributeValue.propTypes    = {
    value:     PropTypes.any,
    attribute: PropTypes.string
};
export const PropertyConfigurationAttribute      =
                 ({value, attribute}) =>
                     <div className={`configuration--attribute property--configuration--attribute ${attribute} attribute__${attribute}`}>
                         <PropertyConfigurationAttributeTitle attribute={attribute} />
                         <PropertyConfigurationAttributeValue attribute={attribute} value={value} />
                     </div>;
PropertyConfigurationAttribute.propTypes         = {
    attribute: PropTypes.string
};