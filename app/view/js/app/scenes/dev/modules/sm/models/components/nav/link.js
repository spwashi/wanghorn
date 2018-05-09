import React from "react"
import * as PropTypes from "prop-types"
import bind from "bind-decorator";
import {getURI} from "../../../../../../../../path/resolution";
import {Link} from "../../../../../../../../components/navigation/components/link";

export class SmID_Link extends React.Component {
    render() {
        const {smID, isActive, onTrigger} = this.props;
        let handleTrigger                 = onTrigger;
        let uri                           = getURI(isActive ? 'dev--home' : 'dev--model', {smID});
        return <Link onClick={(event: React.SyntheticEvent) => {return handleTrigger(smID);}}
                     replace
                     onKeyDown={this.handleKeyDown}
                     data-sm_id={smID}
                     to={uri}>{smID}</Link>;
    }
    
    @bind
    handleKeyDown(event) {
        const handleTrigger = this.props.onTrigger || (() => {});
        const {keyCode}     = event;
        switch (keyCode) {
            case 32:
                const smID = event.target.dataset.sm_id;
                event.preventDefault();
                handleTrigger(smID);
                event.stopPropagation();
                break;
        }
    }
}

SmID_Link.propTypes = {
    smID:      PropTypes.string,
    isActive:  PropTypes.bool,
    onTrigger: PropTypes.func
};