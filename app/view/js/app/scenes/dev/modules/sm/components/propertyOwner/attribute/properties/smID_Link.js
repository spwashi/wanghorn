import React from "react"
import * as PropTypes from "prop-types"
import {SmID_Link} from "../../../../models/components/nav/link";
import {getURI} from "../../../../../../../../../path/resolution";

export const PropertySmIDLink = ({smID, children, onTrigger, isActive}) => {
    onTrigger             = onTrigger || (() => {});
    const activeClassName = isActive ? 'active' : 'inactive';
    const propertyOwner   = /{\[([a-zA-Z_]+)]([a-zA-z_]+)}\s?([a-zA-Z_]+)/.exec(smID);
    const ownerType       = propertyOwner && propertyOwner[1] && propertyOwner[1].toLowerCase();
    const ownerName       = propertyOwner && propertyOwner[2];
    const propertyName    = propertyOwner && propertyOwner[3];
    
    let uri = `#${smID.replace(' ', '')}`;
    switch (ownerType) {
        case 'model':
            uri = getURI('dev--' + ownerType + '--property', {
                                                                 owner:    ownerName,
                                                                 property: propertyName
                                                             }) || uri;
            break;
        case 'entity':
            uri = getURI('dev--' + ownerType + '--property', {
                                                                 owner:    ownerName,
                                                                 property: propertyName
                                                             }) || uri;
            break;
    }
    return (
        <SmID_Link to={uri} maintainHash={true} smID={smID} onTrigger={onTrigger} className={`attribute__properties--link--wrapper ${activeClassName}`}>
            {children || smID}
        </SmID_Link>
    );
};
PropertySmIDLink.propTypes    = {
    smID:      PropTypes.string,
    isActive:  PropTypes.bool,
    children:  PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    onTrigger: PropTypes.func
};