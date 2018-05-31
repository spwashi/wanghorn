import React from "react"
import * as PropTypes from "prop-types"
import bind from "bind-decorator";

class Tag extends React.Component {
    @bind
    handleClick(event) {
        if (event.isPropagationStopped()) return;
        this.attemptNavigation() && event.stopPropagation();
    }
    
    attemptNavigation() {
        if (!this.props.externalLink) return;
        
        const link = this.props.externalLink;
        const win  = window.open(link, '_blank');
        win.focus && win.focus();
        
        return true;
    }
    
    render() {
        const {className, children} = this.props;
        const clickableClass        = this.props.externalLink ? 'clickable' : '';
        const child                 = this.props.externalLink ? <a href={this.props.externalLink} onClick={event => {event.preventDefault();}}>{children}</a> : children;
        return <div className={`tag ${clickableClass} ${className}`} onClick={this.handleClick}>{child}</div>;
    }
}

Tag.propTypes = {
    externalLink: PropTypes.string,
    className:    PropTypes.string,
    children:     PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};

export default Tag;