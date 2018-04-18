import React from "react"
import * as PropTypes from "prop-types"
import bind from "bind-decorator";
import Tag from "./tag";

class TagContainer extends React.Component {
    createTagElements() {
        let tags = this.props.tags;
        if (Array.isArray(tags)) {
            tags = {
                general: tags
            }
        } else if (!(typeof tags === "object")) {
            throw new Error("Can only instantiate from objects or arrays");
        }
        
        return Object.entries(tags)
                     .map(([category, tags]) => {
                         if (!Array.isArray(tags)) tags = [tags];
                         return tags.map(tag => {
                             const {text, name, url} = tag;
                             const tag_id            = `${category}__${name}`;
                             return (
                                 <Tag key={tag_id}
                                      externalLink={url}
                                      className={`gallery_item--tag tag-_-${tag_id} gallery_item--tag__${name}`}>
                                     {text}
                                 </Tag>
                             );
                         });
                     })
    }
    
    render() {
        return (
            <div className="gallery_item--tag--container tag--container">
                {this.createTagElements()}
            </div>
        );
    };
}

export default class Item extends React.Component {
    @bind
    handleClick(event) {
        if (event.isPropagationStopped()) return;
        
        this.attemptNavigation() || event.stopPropagation();
    }
    
    attemptNavigation() {
        if (!this.props.externalLink) return;
        
        const link = this.props.externalLink;
        const win  = window.open(link, '_blank');
        win.focus && win.focus();
        
        return true;
    }
    
    @bind
    handleKeyDown(event) {
        if (event.keyCode === 32) {
            this.attemptNavigation();
            event.preventDefault();
        }
    }
    
    render() {
        let {img: children, name, price, status, externalLink, tags} = this.props;
        const formatted_price                                        = price.toFixed(2)
                                                                            .replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        tags                                                         = tags || [];
        const clickableClass                                         = externalLink ? 'clickable ' : '';
        return (
            <div onClick={this.handleClick} onKeyDown={this.handleKeyDown} tabIndex={0} className={`gallery_item  ${clickableClass}`}>
                <div className={`gallery_item--image--wrapper image--wrapper`}>{children}</div>
                <div className="gallery_item--name name">{name}</div>
                <div className="gallery_item--price price">${formatted_price.replace('.00', '')}</div>
                <div className="gallery_item--status status">{status}</div>
                <TagContainer tags={tags} />
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