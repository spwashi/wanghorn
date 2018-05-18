import React from "react"
import {withRouter} from "react-router";
import * as PropTypes from "prop-types"
import {Link} from "./link";
import bind from 'bind-decorator';

const DefaultWrapper         = p => <div {...p} />;
export const ListLinkWrapper = p => <li {...p} />;

class LinkItem extends React.Component {
    static contextTypes = {router: PropTypes.object.isRequired};
    static propTypes    = {
        // What happens on the trigger. Receives an event.
        onTrigger:       PropTypes.func,
        // The component that will wrap this link
        wrapper:         PropTypes.func,
        // Run when the link receives focus
        whenFocused:     PropTypes.func,
        // Run when the link loses focus
        whenBlurred:     PropTypes.func,
        // What happens when the spaceBar is pressed
        onSpaceBar:      PropTypes.func,
        // Should this link match the route exactly?
        exact:           PropTypes.bool,
        // Should we redirect the component to this route?
        redirect:        PropTypes.bool,
        // Can we use the "tab" key to access this element?
        isTabAccessible: PropTypes.bool,
        // The classname of the wrapper when this link is active
        activeClassName: PropTypes.string,
        // The classname of the wrapper in general
        className:       PropTypes.string,
        // What goes inside this link
        children:        PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.array]).isRequired,
        // Is the link active?
        isActive:        PropTypes.bool,
        // Is the link a button? Changes activation
        isButton:        PropTypes.bool,
        // Where the link should lead
        to:              PropTypes.string
    };
           state        = {isFocused: false};
    
    @bind
    handleKeyboard(event) {
        const onSpaceBar = this.props.onSpaceBar;
        const onTrigger  = this.props.onTrigger;
        
        onTrigger && onTrigger(event);
        
        const is_spaceBar = event.keyCode === 32;
        
        if (is_spaceBar && this.props.descendants && onSpaceBar) {
            let res = onSpaceBar(event);
            if (typeof res === false) return false;
        }
        
        let canNavigate = (event.keyCode === 13 && !this.props.isButton) || (this.props.isButton && is_spaceBar);
        
        if (!canNavigate) return;
        
        this.context.router.history.push(this.props.to);
        event.preventDefault();
    }
    
    componentWillMount() {
        const onIsActive = this.props.onIsActive;
        if (this.isActive && onIsActive) onIsActive();
    }
    
    render() {
        let {className, activeClassName}                      = this.props;
        let {to, exact}                                       = this.props;
        let {children, descendants, wrapper = DefaultWrapper} = this.props;
        let {onTrigger, whenFocused, whenBlurred}             = this.props;
        const Wrapper                                         = wrapper;
        const onKeyDown                                       = this.onKeyDownHandler.bind(this);
        const onLinkFocus                                     = () => {
            this.setState({isFocused: true}, () => whenFocused && whenFocused())
        };
        const onLinkBlur                                      = () => {
            this.setState({isFocused: false}, () => whenBlurred && whenBlurred())
        };
        const isActive                                        = this.isActive;
        const isFocused                                       = this.state.isFocused;
        const activeClassname                                 = isActive ? ' active active--link' : '';
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
        className                                             = className ? ' ' + className : '';
        className                                             = `link_item navigation--link_item${className}${activeClassname}`;
        className                                             = `${className}${isFocused ? ' focused' : ''}`;
        const isTabAccessible                                 = typeof this.props.isTabAccessible !== "undefined" ? this.props.isTabAccessible
                                                                                                                  : true;
        return (
            <Wrapper className={className} onKeyDown={onKeyDown} onClick={onTrigger || (() => {})}>
                <Link {...linkProps} tabIndex={isTabAccessible ? 0 : -1}>{children}</Link>
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
        
        if (typeof this.props.isActive === 'boolean') return this.props.isActive;
        if (typeof this.props.isActive === 'function') return this.props.isActive();
        
        return to && to[0] === '#' ? location.hash === to
                                   : location.pathname.replace(/\/$/, "") === to.replace(/\/$/, "");
    }
}

LinkItem = withRouter(LinkItem);
export {LinkItem};
