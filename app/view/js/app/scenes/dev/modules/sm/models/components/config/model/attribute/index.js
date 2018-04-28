import React from "react"
import * as PropTypes from "prop-types"
import {ConfigurationAttribute} from "../../../../../../../components/configuration";

const ModelConfigurationAttribute = props => {
    return <ConfigurationAttribute {...props} ownerType={"model"} />;
};

export default ModelConfigurationAttribute;
ModelConfigurationAttribute.propTypes = {
    attribute: PropTypes.string,
    meta:      PropTypes.element
};
