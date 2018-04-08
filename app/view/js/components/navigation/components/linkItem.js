import React from "react"
import {withRouter} from "react-router";
import * as PropTypes from "prop-types"
import {Link} from "./link";
import bind from 'bind-decorator';

class LinkItem extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {};
    }
    
    @bind
    handleKeyboard(event) {
        if (event.keyCode !== 32) return;
        const {onTrigger} = this.props;
        onTrigger && onTrigger(...args);
        if (event.isPropagationStopped()) return;
        this.setState({redirect: true});
        event.preventDefault();
    }
    
    render() {
        let {
                exact,
                activeClassName,
                to,
                className,
                children,
                wrapper,
                location,
                onKeyDown,
                onTrigger,
            } = this.props;
        
        const Wrapper         = wrapper || (p => (<div {...p} />));
        const isActive        = location.pathname.replace(/\/$/, "") === to.replace(/\/$/, "");
        const activeClassname = isActive ? 'active active--link' : '';
        className             = className || '';
        className             = `link_item navigation--link_item ${className} ${activeClassname}`;
        
        const onKeyDownHandler = (...args) => {
            const _okd = onKeyDown;
            const res  = typeof _okd === 'function' ? _okd(...args) : _okd;
            return (res || typeof res === "undefined") && this.handleKeyboard(...args);
        };
        
        return (
            <Wrapper className={className}
                     onKeyDown={onKeyDownHandler}
                     onClick={onTrigger || (() => {})}>
                <Link redirect={this.state.redirect}
                      exact={exact}
                      to={to}
                      activeClassName={activeClassName}>
                    {children}
                </Link>
            </Wrapper>);
    }
}

LinkItem           = withRouter(LinkItem);
LinkItem.propTypes = {
    onTrigger:       PropTypes.func,
    wrapper:         PropTypes.func,
    exact:           PropTypes.bool,
    activeClassName: PropTypes.string,
    to:              PropTypes.string,
    className:       PropTypes.string,
    children:        PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired
};
export {LinkItem};
