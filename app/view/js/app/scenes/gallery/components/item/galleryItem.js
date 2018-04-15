import React from "react"
import * as PropTypes from "prop-types"
import bind from "bind-decorator";

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
        let {children, name, price, status, externalLink, tags} = this.props;
        const formatted_price                                   = price.toFixed(2)
                                                                       .replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        tags                                                    = tags || [];
        
        const Tags = ({tags}) => {
            if (Array.isArray(tags)) {
                tags = {
                    general: tags
                }
            } else if (!(typeof tags === "object")) {
                throw new Error("Can only instantiate from objects or arrays");
            }
            
            return Object.entries(tags)
                         .map(([index, tags]) => {
                             console.log(index, tags);
                             if (!Array.isArray(tags)) tags = [tags];
                             return tags.map(tag =>
                                                 <Tag key={index + '-_-' + tag} className={`gallery_item--tag tag-_-${index} gallery_item--tag__${tag}`}>
                                                     {tag}
                                                 </Tag>)
                         })
        };
        
        return (
            <div className={"gallery_item " + (externalLink ? 'clickable ' : '')} onClick={this.handleClick}>
                <div className="gallery_item--image--wrapper image--wrapper">{children}</div>
                <div className="gallery_item--status status">{status}</div>
                <div className="gallery_item--name name">{name}</div>
                <div className="gallery_item--price price">${formatted_price.replace('.00', '')}</div>
                <div className="gallery_item--tag--container tag--container">
                    {<Tags tags={tags} />}
                </div>
            </div>
        )
    }
}

GalleryItem.propTypes = {
    children: PropTypes.element,
    name:     PropTypes.string,
    status:   PropTypes.string,
    price:    PropTypes.number,
    tags:     PropTypes.oneOfType([
                                      PropTypes.arrayOf(PropTypes.string),
                                      PropTypes.object
                                  ]),
    
    externalLink: PropTypes.string
};