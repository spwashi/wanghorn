import React from "react"
import * as PropTypes from "prop-types"
import bind from "bind-decorator";

export default class GalleryItem extends React.Component {
    @bind
    handleClick() {
        if (this.props.externalLink) {
            const link = this.props.externalLink;
            const win  = window.open(link, '_blank');
            win.focus();
        }
    }
    
    render() {
        const {children, name, price, status, externalLink} = this.props;
        return (
            <div className={"gallery_item " + (externalLink ? 'clickable ' : '')} onClick={this.handleClick}>
                <div className="gallery_item--image--wrapper image--wrapper">{children}</div>
                <div className="gallery_item--status status">{status}</div>
                <div className="gallery_item--name name">{name}</div>
                <div className="gallery_item--price price">{price}</div>
            </div>
        )
    }
}

GalleryItem.propTypes = {
    children: PropTypes.element,
    name:     PropTypes.string,
    status:   PropTypes.string,
    price:    PropTypes.number,
    
    externalLink: PropTypes.string
};