import React from "react"
import {withRouter} from "react-router";
import * as PropTypes from "prop-types"
import {Link} from "./link";
import bind from 'bind-decorator';

const DefaultWrapper         = p => <div {...p} />;
export const ListLinkWrapper = p => <li {...p} />;

class LinkItem extends React.Component {
    state = {isFocused: false};
    
    @bind
    handleKeyboard(event) {
        if (event.keyCode !== 32) return;
        const {onTrigger} = this.props;
        onTrigger && onTrigger(...args);
        if (event.isPropagationStopped()) return;
        this.setState({redirect: true});
        event.preventDefault();
    }
    
    componentWillMount() {
        const onIsActive = this.props.onIsActive;
        if (this.isActive && onIsActive) onIsActive();
    }
    
    render() {
        let {className, activeClassName}                      = this.props;
        let {to, location, exact}                             = this.props;
        let {children, descendants, wrapper = DefaultWrapper} = this.props;
        let {onTrigger, onIsActive}                           = this.props;
        const Wrapper                                         = wrapper;
        const onKeyDown                                       = this.onKeyDownHandler.bind(this);
        const onLinkFocus                                     = () => {this.setState({isFocused: true})};
        const onLinkBlur                                      = () => {this.setState({isFocused: false})};
        const isActive                                        = this.isActive;
        const isFocused                                       = this.state.isFocused;
        const activeClassname                                 = isActive ? ' active active--link' : '';
        className                                             = className ? ' ' + className : '';
        className                                             = `link_item navigation--link_item${className}${activeClassname}`;
        className                                             = `${className}${isFocused ? ' focused' : ''}`;
        const redirect                                        = this.state.redirect;
        const linkProps                                       = {
            to,
            exact,
            redirect,
            activeClassName,
            onFocus:  onLinkFocus,
            onBlur:   onLinkBlur,
            isActive: !!isActive
        };
        return (
            <Wrapper className={className} onKeyDown={onKeyDown} onClick={onTrigger || (() => {})}>
                <Link {...linkProps} >
                    {children}
                </Link>
                {descendants}
            </Wrapper>);
    }
    
    onKeyDownHandler(...args) {
        const _okd = this.props.onKeyDown;
        const res  = typeof _okd === 'function' ? _okd(...args) : _okd;
        return (res || typeof res === "undefined") && this.handleKeyboard(...args);
    }
    
    get isActive() {
        const {to, location} = this.props;
        
        if (typeof this.props.isActive !== "undefined") {return;}
        
        return to && to[0] === '#' ? location.hash === to
                                   : location.pathname.replace(/\/$/, "") === to.replace(/\/$/, "");
    }
}

LinkItem.propTypes = {
    onTrigger:       PropTypes.func,
    wrapper:         PropTypes.func,
    exact:           PropTypes.bool,
    isActive:        PropTypes.bool,
    onIsActive:      PropTypes.func,
    activeClassName: PropTypes.string,
    to:              PropTypes.string,
    className:       PropTypes.string,
    children:        PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.array]).isRequired
};
LinkItem           = withRouter(LinkItem);
export {LinkItem};
