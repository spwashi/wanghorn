import React from "react";
import * as PropTypes from "prop-types"
import bind from "bind-decorator";
import {TweenLite} from "gsap";
// animation imports
import "gsap/ScrollToPlugin";
import {LinkItem} from "base-components/navigation";

export class ContentSectionLink extends React.Component {
    _anchor;
    
    constructor(props) {
        super(props);
        this._anchor = `#${props.anchor}`;
    }
    
    @bind
    onTrigger(event) {
        if (!this.props.doScroll) return;
        TweenLite.to(window, .5,
                     {
                         scrollTo:   this._anchor,
                         onComplete: () => window.location.hash = this._anchor.replace('#', '')
                     })
    }
    
    render() {
        let {anchor, isActive, children, onRequestFollow, ...attrs} = this.props;
        onRequestFollow                                             = onRequestFollow || (() => true);
        return <LinkItem onKeyDown={event => event.stopPropagation()}
                         isActive={isActive}
                         onTrigger={event => {
                             Promise.resolve(onRequestFollow(anchor))
                                    .then(i => {
                                        this.onTrigger(event);
                                    })
                         }}
                         to={`#${anchor}`} {...attrs}>{children}</LinkItem>
    };
}

ContentSectionLink.propTypes = {
    ...LinkItem.propTypes,
    anchor:          PropTypes.string,
    doScroll:        PropTypes.bool,
    isActive:        PropTypes.bool,
    onRequestFollow: PropTypes.func
};
