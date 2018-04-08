import React from "react";
import * as PropTypes from "prop-types"
import bind from "bind-decorator";
import {TweenLite} from "gsap";
// animation imports
import "gsap/ScrollToPlugin";
import {LinkItem} from "../../../../../components/navigation";

export class ContentSectionLink extends React.Component {
    _anchor;
    
    constructor(props) {
        super(props);
        this._anchor = `#${props.anchor}`;
    }
    
    @bind
    onTrigger(event) {
        TweenLite.to(window, .5,
                     {
                         scrollTo:   this._anchor,
                         onComplete: () => window.location.hash = this._anchor.replace('#', '')
                     })
    }
    
    render() {
        let {anchor, children, ...attrs} = this.props;
        return <LinkItem onKeyDown={event => event.stopPropagation()}
                         onTrigger={this.onTrigger}
                         to={`#${anchor}`} {...attrs}>{children}</LinkItem>
    };
}

ContentSectionLink.propTypes = {
    ...LinkItem.propTypes,
    anchor: PropTypes.string
};
