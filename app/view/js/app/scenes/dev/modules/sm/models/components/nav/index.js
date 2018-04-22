import React from "react"
import * as PropTypes from "prop-types"
import {SmID_Link} from "./link";

class ModelLinkItem extends React.Component {
    render() {
        const {smID, isActive, onItemTrigger} = this.props;
        return (
            <li className={`${!(isActive) ? '' : 'active'} model--container--link model--smID--link`}>
                <SmID_Link onTrigger={onItemTrigger} smID={smID} isActive={isActive} />
            </li>
        )
    }
}

ModelLinkItem.propTypes = {
    smID:          PropTypes.string,
    onItemTrigger: PropTypes.func,
    isActive:      PropTypes.bool
};

class ModelLinkContainer extends React.Component {
    render() {
        const {activeSmIDs, onItemTrigger, allSmIDs} = this.props;
        return (
            <ul className={"model--container--link--container"}>
                {
                    allSmIDs.map(smID => <ModelLinkItem key={smID}
                                                        smID={smID}
                                                        onItemTrigger={onItemTrigger}
                                                        isActive={activeSmIDs.indexOf(smID) > -1} />)
                }
            </ul>
        );
    }
}

export default ModelLinkContainer;
ModelLinkContainer.propTypes    = {
    activeSmIDs:   PropTypes.arrayOf(PropTypes.string),
    allSmIDs:      PropTypes.arrayOf(PropTypes.string),
    onItemTrigger: PropTypes.func
};
ModelLinkContainer.defaultProps = {
    activeSmIDs: [],
    allSmIDs:    []
};