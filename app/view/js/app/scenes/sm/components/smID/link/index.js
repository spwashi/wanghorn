import React          from "react"
import * as PropTypes from "prop-types"
import bind           from "bind-decorator";
import {LinkItem}     from "../../../../../../components/navigation/index";

export class SmID_Link extends React.Component {
    render() {
        const {smID, onTrigger, to, className, children} = this.props;
        let maintainHash                                           = this.props.maintainHash;
        let handleTrigger                                          = onTrigger;
        const onClick                                              = (event: React.SyntheticEvent) => {return handleTrigger(smID);};
        return <LinkItem to={to}
                         wrapper={p => <span {...p} />}
                         maintainHash={maintainHash}
                         onClick={onClick}
                         exact={false}
                         className={'smID--link ' + (className || '')}
                         onKeyDown={this.handleKeyDown}
                         data-sm_id={smID}>{children || smID}</LinkItem>;
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
    smID:         PropTypes.string.isRequired,
    isActive:     PropTypes.bool,
    to:           PropTypes.string.isRequired,
    onTrigger:    PropTypes.func,
    maintainHash: PropTypes.bool
};