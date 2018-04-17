import React from "react"
import * as PropTypes from "prop-types"
import bind from "bind-decorator";

class Tag extends React.Component {
    @bind
    handleClick(event) {
        if (event.isPropagationStopped()) return;
        this.attemptNavigation() || event.stopPropagation();
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
        return (
            <div className={`tag ${clickableClass} ${className}`} onClick={this.handleClick}>
                {children}
            </div>
        )
    }
}

Tag.propTypes = {
    externalLink: PropTypes.string,
    className:    PropTypes.string,
    children:     PropTypes.string
};

export default Tag;