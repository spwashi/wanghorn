import React from "react"
import * as PropTypes from "prop-types"

export default class GalleryItemContainer extends React.Component {
    
    render() {
        const {children} = this.props;
        return (
            <section className="gallery_item--container">
                {children}
            </section>
        )
    }
}
GalleryItemContainer.propTypes = {
    children: PropTypes.arrayOf(PropTypes.element)
};