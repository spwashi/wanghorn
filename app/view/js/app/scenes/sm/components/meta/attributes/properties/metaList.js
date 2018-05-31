import React from "react"
import * as PropTypes from "prop-types"
import {getTitleFromPropName, normalizeSmID} from "../../../../../dev/modules/sm/utility";
import {PropertySmIDLink} from "./smID_Link";

class PropertiesAttrMetaList extends React.Component {
    render() {
        const {properties, onPropertyLinkTrigger} = this.props;
        const activeProperties                    = this.props.activeProperties || [];
        return (
            <ul className={`attribute__properties--meta-list attribute__properties--link--container`}>
                {
                    Object.entries(properties)
                          .filter(([name, config]) => !!config.smID)
                          .map(([name, config]) => {
                              let smID       = normalizeSmID(config.smID);
                              const isActive = (activeProperties).indexOf(smID) >= 0;
                              let title      = getTitleFromPropName(name);
                              return (
                                  <PropertySmIDLink isActive={isActive} onTrigger={onPropertyLinkTrigger} key={name} smID={smID}>
                                      {title}
                                  </PropertySmIDLink>
                              );
                          })
                }
            </ul>
        )
        
    }
}

export default PropertiesAttrMetaList;
PropertiesAttrMetaList.propTypes = {
    properties:            PropTypes.object,
    activeProperties:      PropTypes.arrayOf(PropTypes.string),
    onPropertyLinkTrigger: PropTypes.func
};