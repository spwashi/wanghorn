import React from "react"
import * as PropTypes from "prop-types"

class Tag extends React.Component {
    render() {
        const {className, children} = this.props;
        return (
            <div className={"tag " + className}>
                {children}
            </div>
        )
    }
}

Tag.propTypes = {
    className: PropTypes.string,
    children:  PropTypes.string
};

export default Tag;