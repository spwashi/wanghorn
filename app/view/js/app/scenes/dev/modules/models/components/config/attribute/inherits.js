import React from "react"
import * as PropTypes from "prop-types"
import {ConfigurationAttribute} from "../../../../../../sm/components/configuration/index";
import {getURI} from "../../../../../../../../path/resolution";
import {getNameFromSmID} from "../../../../../../sm/utility";
import SmID_LinkContainer from "../../../../../../sm/components/meta/nav";

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