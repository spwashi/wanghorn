import React from "react"
import * as PropTypes from "prop-types"

export const ConfigurationTitle       = ({ownerType, children}) => {
    return <div className={`title configuration--title ${ownerType}--configuration--title`}>
        {children}
    </div>;
};
export const ConfigurationDescription = ({children: description, ownerType}) =>
    <div className={`description configuration--description ${ownerType}--configuration--description`}>
        {description}
    </div>;
ConfigurationTitle.propTypes          = {
    children:  PropTypes.any,
    ownerType: PropTypes.string
};
ConfigurationDescription.propTypes    = {
    children:  PropTypes.any,
    ownerType: PropTypes.string
};