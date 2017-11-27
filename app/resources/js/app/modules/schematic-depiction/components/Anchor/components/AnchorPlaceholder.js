import React, {Component} from "react";
import PropTypes from "prop-types"
import {Anchor} from "../index";

export default class AnchorPlaceholder extends Component {
    render() {
        let anchor = null;
        
        if (this.props.anchorID) {
            anchor = <Anchor anchorID={this.props.anchorID} />
        }
        
        return (
            <div className="anchor--ampersand" tabIndex={0}>{anchor}</div>
        );
    }
}

AnchorPlaceholder.propTypes = {
    anchorID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export {AnchorPlaceholder}