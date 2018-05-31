import React from "react"
import * as PropTypes from "prop-types"
import SmID_LinkContainer from "../../../../../../../sm/components/meta/nav/index";
import {ConfigurationAttribute} from "../../../../../../components/configuration/index";
import {getURI} from "../../../../../../../../../path/resolution";
import {getNameFromSmID} from "../../../../utility";

const EntityConfigurationInheritsAttribute     =
          ({inherits}) => {
              inherits              = Array.isArray(inherits) ? inherits : [];
              const getSmID_LinkURI = smID => getURI('dev--entity', {name: getNameFromSmID(smID)});
              return (
                  <ConfigurationAttribute ownerType={'entity'} attribute="inherits">
                      <SmID_LinkContainer getSmID_LinkURI={getSmID_LinkURI} allSmIDs={inherits} ownerType={'entity'} />
                  </ConfigurationAttribute>
              );
          };
EntityConfigurationInheritsAttribute.propTypes = {
    inherits: PropTypes.arrayOf(PropTypes.string)
};
export default EntityConfigurationInheritsAttribute;