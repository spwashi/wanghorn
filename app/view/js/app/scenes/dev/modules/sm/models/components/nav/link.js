import React from "react"
import * as PropTypes from "prop-types"
import bind from "bind-decorator";

export class SmID_Link extends React.Component {
    render() {
        const {smID, isActive, onTrigger} = this.props;
        let handleTrigger                 = onTrigger;
        return <a onClick={handleTrigger} onKeyDown={this.handleKeyDown} data-sm_id={smID} href={`#${smID}`}>{smID}</a>;
    }
    
    @bind
    handleKeyDown(event) {
        const handleTrigger = this.props.onTrigger || (() => {});
        const {keyCode}     = event;
        switch (keyCode) {
            case 32:
                handleTrigger(event);
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