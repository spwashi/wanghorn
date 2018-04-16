import React from "react"
import * as PropTypes from "prop-types"
import bind from "bind-decorator";
import Tag from "./tag";

export default class Item extends React.Component {
    @bind
    handleClick() {
        if (this.props.externalLink) {
            const link = this.props.externalLink;
            const win  = window.open(link, '_blank');
            win.focus();
        }
    }
    
    render() {
        let {img: children, name, price, status, externalLink, tags} = this.props;
        const formatted_price                                        = price.toFixed(2)
                                                                            .replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        tags                                                         = tags || [];
        
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
                             if (!Array.isArray(tags)) tags = [tags];
                             return tags.map(tag => {
                                 const {text, name} = tag;
                                 return (
                                     <Tag key={`${index}-_-${name}`} className={`gallery_item--tag tag-_-${index} gallery_item--tag__${name}`}>
                                         {text}
                                     </Tag>
                                 );
                             });
                         })
        };
        
        return (
            <div className={"gallery_item "}>
                <div onClick={this.handleClick} className={"gallery_item--image--wrapper image--wrapper " + (externalLink ? 'clickable ' : '')}>{children}</div>
                <div className="gallery_item--name name">{name}</div>
                <div className="gallery_item--price price">${formatted_price.replace('.00', '')}</div>
                <div className="gallery_item--status status">{status}</div>
                <div className="gallery_item--tag--container tag--container">
                    {<Tags tags={tags} />}
                </div>
            </div>
        )
    }
}

Item.propTypes = {
    img:    PropTypes.element.isRequired,
    name:   PropTypes.string.isRequired,
    status: PropTypes.string,
    price:  PropTypes.number,
    tags:   PropTypes.oneOfType([
                                    PropTypes.arrayOf(
                                        PropTypes.oneOfType(
                                            [PropTypes.string, PropTypes.object]
                                        )
                                    ),
                                    PropTypes.object
                                ]),
    
    externalLink: PropTypes.string
};