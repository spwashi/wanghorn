import React from "react"
import * as PropTypes from "prop-types"

export const PropertyConfigurationAttributeTitle =
                 ({attribute}) =>
                     <h4 className={`attribute--title
                                     configuration--attribute--title
                                     property--configuration--attribute--title
                                     attribute__${attribute}--title`}>{attribute.replace(/([A-Z][a-z])/g, ' $1').trim()}</h4>;

PropertyConfigurationAttributeTitle.propTypes    = {
    attribute: PropTypes.string
};