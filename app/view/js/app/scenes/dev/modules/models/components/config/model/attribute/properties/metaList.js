import React from "react"
import * as PropTypes from "prop-types"
import {normalizeSmID} from "../../../../../sm/utility";

const PropertySmIDLink     = ({smID, children, onTrigger, isActive}) => {
    onTrigger             = onTrigger || (() => {});
    let handleClick       = (event) => {
        onTrigger(smID, event);
        event.stopPropagation();
    };
    const activeClassName = isActive ? 'active' : 'inactive';
    return (
        <a className={`attribute__properties--link ${activeClassName}`} href={`#${smID.replace(' ', '')}`} onClick={handleClick}>
            {children}
        </a>
    );
};
PropertySmIDLink.propTypes = {
    smID:      PropTypes.string,
    isActive:  PropTypes.bool,
    children:  PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    onTrigger: PropTypes.func
};

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
                              return (
                                  <PropertySmIDLink isActive={isActive} onTrigger={onPropertyLinkTrigger} key={name} smID={smID}>
                                      {name}
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