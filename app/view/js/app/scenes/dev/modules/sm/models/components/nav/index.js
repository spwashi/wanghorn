import React from "react"
import * as PropTypes from "prop-types"
import {SmID_Link} from "./link";

class SmID_LinkItem extends React.Component {
    render() {
        const {smID, to, isActive, onItemTrigger, ownerType} = this.props;
        return (
            <li className={`${!(isActive) ? '' : 'active'} ${ownerType}--container--link ${ownerType}--smID--link`}>
                <SmID_Link to={to} onTrigger={onItemTrigger} smID={smID} isActive={isActive} />
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
        const {activeSmIDs, onItemTrigger, allSmIDs, ownerType} = this.props;
        
        return (
            <ul className={`link--container dev_component--link--container ${ownerType}--container--link--container`}>
                {
                    allSmIDs.map(smID => {
                        const isActive = activeSmIDs.indexOf(smID) > -1;
                        let uri        = this.props.getSmID_LinkURI(smID);
                        return <SmID_LinkItem key={smID}
                                              ownerType={/\[([a-zA-Z_]+)]/.exec(smID)[1]}
                                              smID={smID}
                                              to={uri}
                                              onItemTrigger={onItemTrigger}
                                              isActive={isActive} />;
                    })
                }
            </ul>
        );
    }
}

export default SmID_LinkContainer;
SmID_LinkContainer.propTypes    = {
    activeSmIDs:     PropTypes.arrayOf(PropTypes.string),
    allSmIDs:        PropTypes.arrayOf(PropTypes.string),
    ownerType:       PropTypes.string,
    onItemTrigger:   PropTypes.func,
    getSmID_LinkURI: PropTypes.func,
};
SmID_LinkContainer.defaultProps = {
    activeSmIDs: [],
    allSmIDs:    []
};