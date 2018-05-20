import React from "react"
import * as PropTypes from "prop-types"
import {SmID_LinkItem} from "../../../components/link/linkItem";

class SmID_LinkContainer extends React.Component {
    render() {
        const {onItemTrigger, allSmIDs, ownerType} = this.props;
        return (
            <ul className={`link--container dev_component--link--container ${ownerType}--container--link--container`}>
                {
                    allSmIDs.map(smID => {
                        return <SmID_LinkItem key={smID}
                                              ownerType={/\[([a-zA-Z_]+)]/.exec(smID)[1]}
                                              smID={smID}
                                              to={this.props.getSmID_LinkURI(smID)}
                                              onItemTrigger={onItemTrigger}
                                              isActive={smID === this.props.activeSmID} />;
                    })
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