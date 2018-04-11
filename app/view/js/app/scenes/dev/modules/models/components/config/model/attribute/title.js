import React from "react"
import * as PropTypes from "prop-types"

export const ModelConfigurationAttributeTitle = ({attribute}) =>
    <div className={`attribute--title
                     configuration--attribute--title
                     model--configuration--attribute--title
                     attribute__${attribute}--title`}>{attribute}</div>;

ModelConfigurationAttributeTitle.propTypes = {
    attribute: PropTypes.string,
};