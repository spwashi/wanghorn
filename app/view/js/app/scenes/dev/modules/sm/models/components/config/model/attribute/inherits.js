import React from "react"
import * as PropTypes from "prop-types"
import ModelLinkContainer from "../../../nav/index";
import {ConfigurationAttribute} from "../../../../../../../components/configuration";

const ModelConfigurationInheritsAttribute     =
          ({inherits}) => {
              inherits = Array.isArray(inherits) ? inherits : [];
              return (
                  <ConfigurationAttribute ownerType={'model'} attribute="inherits">
                      <ModelLinkContainer allSmIDs={inherits} />
                  </ConfigurationAttribute>
              );
          };
ModelConfigurationInheritsAttribute.propTypes = {
    inherits: PropTypes.arrayOf(PropTypes.string)
};
export default ModelConfigurationInheritsAttribute;