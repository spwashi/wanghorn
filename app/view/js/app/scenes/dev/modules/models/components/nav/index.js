import React from "react"
import * as PropTypes from "prop-types"

const ModelLinkItem     = ({smID, isActive, onClick}) => {
    return (
        <li className={`${!isActive ? '' : 'active'} model--container--link model--smID--link`}>
            <a onClick={onClick} data-sm_id={smID} href={`#${smID}`}>{smID}</a>
        </li>
    )
};
ModelLinkItem.propTypes = {
    smID:     PropTypes.string,
    isActive: PropTypes.bool,
    onClick:  PropTypes.func
};

export default class ModelLinkContainer extends React.Component {
    render() {
        const {activeSmIDs, onItemClick, allSmIDs} = this.props;
        return (
            <ul className={"model--container--link--container"}>
                {allSmIDs.map(smID => <ModelLinkItem key={smID}
                                                     onClick={onItemClick}
                                                     smID={smID}
                                                     isActive={activeSmIDs.indexOf(smID) > -1} />)}
            </ul>
        );
    }
}

ModelLinkContainer.propTypes = {
    activeSmIDs: PropTypes.arrayOf(PropTypes.string),
    allSmIDs:    PropTypes.arrayOf(PropTypes.string),
    onItemClick: PropTypes.func
};