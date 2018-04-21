import React from "react"
import * as PropTypes from "prop-types"

const PropertySmIDLink     = ({smID, children, onTrigger}) => {
    onTrigger       = onTrigger || (() => {});
    let handleClick = (event) => {
        onTrigger(smID, event);
        event.stopPropagation();
    };
    return (
        <a className={`attribute__properties--link`} href={`#${smID.replace(' ', '')}`} onClick={handleClick}>
            {children}
        </a>
    );
};
PropertySmIDLink.propTypes = {
    smID:      PropTypes.string,
    children:  PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    onTrigger: PropTypes.func
};

const PropertiesAttrMetaList = ({properties, onPropertyLinkTrigger}) => {
    return (
        <ul className={`attribute__properties--meta-list attribute__properties--link--container`}>
            {
                Object.entries(properties)
                      .filter(([name, config]) => !!config.smID)
                      .map(([name, config]) =>
                               <PropertySmIDLink onTrigger={onPropertyLinkTrigger} key={name} smID={config.smID}>
                                   {name}
                               </PropertySmIDLink>)
            }
        </ul>
    )
};
export default PropertiesAttrMetaList;
PropertiesAttrMetaList.propTypes = {
    properties:            PropTypes.object,
    onPropertyLinkTrigger: PropTypes.func
};