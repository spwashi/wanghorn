import React from "react"
import * as PropTypes from "prop-types"
import ModelConfigurationAttribute from "./index";
import ModelLinkContainer from "../../../nav/index";

const ModelConfigurationInheritsAttribute     =
          ({inherits}) => {
              inherits = Array.isArray(inherits) ? inherits : [];
              return (
                  <ModelConfigurationAttribute attribute="inherits">
                      <ModelLinkContainer allSmIDs={inherits} />
                  </ModelConfigurationAttribute>
              );
          };
ModelConfigurationInheritsAttribute.propTypes = {
    inherits: PropTypes.arrayOf(PropTypes.string)
};
export default ModelConfigurationInheritsAttribute;