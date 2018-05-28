import React from "react"
import * as PropTypes from "prop-types"
import {SmID_Link} from "./index";

export class SmID_LinkItem extends React.Component {
    render() {
        let {smID, to, isActive, onItemTrigger: onTrigger, ownerType} = this.props;
        ownerType                                                     = ownerType ? ownerType.toLowerCase()
                                                                                  : null;
        
        let ownerTypeClassName    = `${ownerType}--container--link ${ownerType}--smID--link`;
        let smEntityClassName = `smEntity--container--link smEntity--smID--link`;
        ownerTypeClassName        = ownerType ? ownerTypeClassName : '';
        let smID_LinkClassName    = `smID--link--item`;
        let activeClassName       = !(isActive) ? '' : 'active';
        let className             = `${activeClassName} ${smID_LinkClassName} ${smEntityClassName} ${ownerTypeClassName}`;
        
        return (
            <li className={className}>
                <SmID_Link {...{to, onTrigger, isActive, smID}} />
            </li>
        )
    }
}

SmID_LinkItem.propTypes = {
    smID:          PropTypes.string,
    onItemTrigger: PropTypes.func,
    isActive:      PropTypes.bool
};