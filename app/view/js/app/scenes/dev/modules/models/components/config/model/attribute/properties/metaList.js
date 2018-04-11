import React from "react"
import * as PropTypes from "prop-types"

const PropertySmID_Link = ({smID, children}) =>
    <a className={`attribute__properties--link`} href={`#${smID.replace(' ', '')}`}>
        {children}
    </a>;

const PropertiesAttrMetaList = ({properties}) => {
    const objectEntryToSmID_Link = ([name, config]) =>
        <PropertySmID_Link key={name} smID={config.smID}>
            {name}
        </PropertySmID_Link>;
    return (
        <ul className={`attribute__properties--meta-list attribute__properties--link--container`}>
            {
                Object.entries(properties)
                      .filter(([name, config]) => !!config.smID)
                      .map(objectEntryToSmID_Link)
            }
        </ul>
    )
};
export default PropertiesAttrMetaList;
PropertiesAttrMetaList.propTypes = {
    properties: PropTypes.object
};