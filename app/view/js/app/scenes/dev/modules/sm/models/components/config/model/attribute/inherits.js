import React from "react"
import * as PropTypes from "prop-types"
import SmID_LinkContainer from "../../../nav/index";
import {ConfigurationAttribute} from "../../../../../../../components/configuration";

const ModelConfigurationInheritsAttribute     =
          ({inherits}) => {
              inherits = Array.isArray(inherits) ? inherits : [];
              return (
                  <ConfigurationAttribute ownerType={'model'} attribute="inherits">
                      <SmID_LinkContainer allSmIDs={inherits} ownerType={'model'} />
                  </ConfigurationAttribute>
              );
          };
ModelConfigurationInheritsAttribute.propTypes = {
    inherits: PropTypes.arrayOf(PropTypes.string)
};
export default ModelConfigurationInheritsAttribute;