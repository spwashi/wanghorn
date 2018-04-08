import React from "react";
import * as PropTypes from "prop-types"
import bind from "bind-decorator";
import {TweenLite} from "gsap";
// animation imports
import "gsap/ScrollToPlugin";

export class ContentSectionLink extends React.Component {
    _anchor;
    
    constructor(props) {
        super(props);
        this._anchor = `#${props.anchor}`;
    }
    
    @bind
    handleClick(event) {
        event.preventDefault();
        TweenLite.to(window, .5,
                     {
                         scrollTo:   this._anchor,
                         onComplete: () => window.location.hash = this._anchor.replace('#', '')
                     })
    }
    
    render() {
        let {anchor, children, ...attrs} = this.props;
        return <a onClick={this.handleClick} href={`#${anchor}`} {...attrs}>{children}</a>
    };
}

ContentSectionLink.propTypes = {
    anchor: PropTypes.string
};
