import React          from "react"
import * as PropTypes from "prop-types"
import {SmID_Link}    from "./index";

export class SmID_LinkItem extends React.Component {
    render() {
        let {smID, to, isActive, onItemTrigger: onTrigger, ownerType} = this.props;
        
        const getSmEntityStatus = this.props.getSmEntityStatus || function () {};
        ownerType               = ownerType ? ownerType.toLowerCase() : null;
        
        let ownerTypeClassName = ownerType ? `${ownerType}--container--link ${ownerType}--smID--link` : ``;
        let smEntityClassName  = `smEntity--container--link smEntity--smID--link`;
        let smID_LinkClassName = `smID--link--item`;
        let activeClassName    = !(isActive) ? '' : 'active';
        let status             = getSmEntityStatus(smID);
        let statusClassName    = this.getStatusClassName(status);
        let className          = `${activeClassName} ${smID_LinkClassName} ${smEntityClassName} ${ownerTypeClassName} ${statusClassName}`;
        
        return (
            <li className={className}>
                <SmID_Link {...{to, onTrigger, isActive, smID}} />
            </li>
        )
    }
    
    getStatusClassName(status) {
        let statusClassName = '';
        
        if (!status) return statusClassName;
        
        if (typeof status === 'string') return statusClassName += 'status__' + status;
        
        if (typeof status !== 'object') return statusClassName;
        
        Object.entries(status).forEach(entry => {
            let [name, status] = entry;
            
            if (/(string|number)/.test(typeof status)) {
                statusClassName += ` status--${name}__${status}`;
            } else if (typeof status === 'boolean') {
                statusClassName += ` status--${name}__${status ? 'true' : 'false'}`
            }
            
        });
        return statusClassName;
    }
}

SmID_LinkItem.propTypes = {
    smID:              PropTypes.string,
    getSmEntityStatus: PropTypes.func,
    onItemTrigger:     PropTypes.func,
    isActive:          PropTypes.bool
};