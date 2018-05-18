import React from "react"
import * as PropTypes from "prop-types"
import {SmID_Link} from "./link";

class SmID_LinkItem extends React.Component {
    render() {
        let {smID, to, isActive, onItemTrigger: onTrigger, ownerType} = this.props;
        ownerType                                                     = ownerType ? ownerType.toLowerCase()
                                                                                  : null;
        
        let ownerTypeClassName = `${ownerType}--container--link ${ownerType}--smID--link`;
        ownerTypeClassName     = ownerType ? ownerTypeClassName : '';
        let smID_LinkClassName = `smID--link--item`;
        let activeClassName    = !(isActive) ? '' : 'active';
        let className          = `${activeClassName} ${smID_LinkClassName} ${ownerTypeClassName}`;
        
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

class SmID_LinkContainer extends React.Component {
    render() {
        const {onItemTrigger, allSmIDs, ownerType} = this.props;
        
        return (
            <ul className={`link--container dev_component--link--container ${ownerType}--container--link--container`}>
                {
                    allSmIDs.map(smID => <SmID_LinkItem key={smID}
                                                        ownerType={/\[([a-zA-Z_]+)]/.exec(smID)[1]}
                                                        smID={smID}
                                                        to={this.props.getSmID_LinkURI(smID)}
                                                        onItemTrigger={onItemTrigger}
                                                        isActive={smID === this.props.activeSmID} />)
                }
            </ul>
        );
    }
}

export default SmID_LinkContainer;
SmID_LinkContainer.propTypes    = {
    activeSmID:      PropTypes.string,
    allSmIDs:        PropTypes.arrayOf(PropTypes.string),
    ownerType:       PropTypes.string,
    onItemTrigger:   PropTypes.func,
    getSmID_LinkURI: PropTypes.func.isRequired,
};
SmID_LinkContainer.defaultProps = {
    allSmIDs: []
};