import React from "react"
import * as PropTypes from "prop-types"
import SmID_LinkContainer from "../../nav/index";
import {ConfigurationAttribute} from "../../../../../../components/configuration/index";
import {getURI} from "../../../../../../../../../path/resolution";
import {getNameFromSmID} from "../../../../utility";

const ModelConfigurationInheritsAttribute     =
          ({inherits}) => {
              inherits              = Array.isArray(inherits) ? inherits : [];
              const getSmID_LinkURI = smID => getURI('dev--model', {name: getNameFromSmID(smID)});
              return (
                  <ConfigurationAttribute ownerType={'model'} attribute="inherits">
                      <SmID_LinkContainer getSmID_LinkURI={getSmID_LinkURI} allSmIDs={inherits} ownerType={'model'} />
                  </ConfigurationAttribute>
              );
          };
ModelConfigurationInheritsAttribute.propTypes = {
    inherits: PropTypes.arrayOf(PropTypes.string)
};
export default ModelConfigurationInheritsAttribute;