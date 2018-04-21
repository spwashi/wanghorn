import React from "react"
import * as PropTypes from "prop-types"
import {ModelLink} from "./link";

const ModelLinkItem = ({smID, isActive, onItemClick}) =>
    <li className={`${!(isActive) ? '' : 'active'} model--container--link model--smID--link`}>
        <ModelLink onClick={onItemClick} smID={smID} />
    </li>;

class ModelLinkContainer extends React.Component {
    render() {
        const {activeSmIDs, onItemClick, allSmIDs} = this.props;
        return (
            <ul className={"model--container--link--container"}>
                {
                    allSmIDs.map(smID => <ModelLinkItem key={smID}
                                                        smID={smID}
                                                        onItemClick={onItemClick}
                                                        isActive={activeSmIDs.indexOf(smID) > -1} />)
                }
            </ul>
        );
    }
}

export default ModelLinkContainer;
ModelLinkContainer.propTypes    = {
    activeSmIDs: PropTypes.arrayOf(PropTypes.string),
    allSmIDs:    PropTypes.arrayOf(PropTypes.string),
    onItemClick: PropTypes.func
};
ModelLinkContainer.defaultProps = {
    activeSmIDs: [],
    allSmIDs:    []
};