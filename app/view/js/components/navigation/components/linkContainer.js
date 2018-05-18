import React from "react"
import {withRouter} from "react-router-dom";

class LinkContainer extends React.Component {
    render() {
        const children = this.props.children;
        return (
            <ul className="link_container navigation--link_container">
                {children}
            </ul>
        );
    }
}

LinkContainer = withRouter(LinkContainer);
export {LinkContainer}