import React from "react"
import * as PropTypes from "prop-types"

export default class FilterContainer extends React.Component {
    render() {
        const {children} = this.props;
        return (
            <div className="gallery_item--filter_control">
                {children}
            </div>
        )
    }
}

FilterContainer.propTypes = {
    title: PropTypes.string,
};