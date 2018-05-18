import React from "react";
import * as PropTypes from "prop-types"
import {LinkItem} from "base-components/navigation";

export class ContentSectionLink extends React.Component {
    _anchor;
    
    constructor(props) {
        super(props);
        this._anchor = `#${props.anchor}`;
    }
    
    render() {
        let {anchor, isActive, children, onRequestFollow, ...attrs} = this.props;
        onRequestFollow                                             = onRequestFollow || (() => true);
        return <LinkItem onKeyDown={event => event.stopPropagation()}
                         isActive={isActive}
                         redirect={true}
                         isButton={true}
                         to={`#${anchor}`}
                         {...attrs}>{children}</LinkItem>
    };
}

ContentSectionLink.propTypes = {
    ...LinkItem.propTypes,
    anchor:          PropTypes.string,
    doScroll:        PropTypes.bool,
    isActive:        PropTypes.bool,
    onRequestFollow: PropTypes.func,
};
