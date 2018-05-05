import React from "react"
import * as PropTypes from "prop-types"
import bind from "bind-decorator";
import Tag from "base-components/tag/index";
import {getURI} from "../../../../../path/resolution";
import {Link} from "../../../../../components/navigation/components/link";

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
                                      className={`gallery_item--tag tag-_-${category} tag-_-${tag_id} gallery_item--tag__${name}`}>
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

const Teaser = ({children: text = ''}) => {
    const character_limit = 40;
    let teaser            = text.split(' ')
                                .reduce(
                                    (all, chunk) => {
                                        all   = all || '';
                                        chunk = ` ${chunk}`;
                                        if ((all.length + chunk.length) < character_limit) {
                                            return all + chunk;
                                        }
                                        return all + ' '.repeat(character_limit - all.length);
                                    }).trim();
    if (teaser !== text) teaser += '...';
    return <div className="teaser">{teaser}</div>;
};
export default class Item extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false
        }
    }
    
    @bind
    handleClick(event) {
        this.attemptNavigation() || event.stopPropagation();
    }
    
    attemptNavigation() {
        if (!this.props.externalLink) {
            this.setState({modalOpen: true});
            return;
        }
        
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
        let {img: children, name, title, price, status, externalLink, tags, description} = this.props;
        const hasModalDialog                                                             = !externalLink;
        const formatted_price                                                            = price.toFixed(2)
                                                                                                .replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        tags                                                                             = tags || [];
        const clickableClass                                                             = externalLink || hasModalDialog ? 'clickable ' : '';
        
        return (
            <div onClick={this.handleClick} onKeyDown={this.handleKeyDown} tabIndex={0} className={`gallery_item  ${clickableClass}`}>
                <div className={`gallery_item--image--wrapper image--wrapper`}>{children}</div>
                <div className={"name gallery_item--name"}>{title}</div>
                <div className={"price gallery_item--price"}>${formatted_price.replace('.00', '')}</div>
                <div className={"status gallery_item--status"}>{status}</div>
                <div className={"description gallery_item--description"}>{!this.props.isExpanded ? <Teaser>{description}</Teaser> : description}</div>
                {hasModalDialog ? <Link className={'view--link'} to={getURI('gallery--item__view', {name}) || externalLink}></Link> : null}
                <TagContainer tags={tags} />
            </div>
        )
    }
}

Item.propTypes = {
    img:        PropTypes.element.isRequired,
    name:       PropTypes.string.isRequired,
    status:     PropTypes.string,
    isExpanded: PropTypes.bool,
    price:      PropTypes.number,
    tags:       PropTypes.oneOfType([
                                        PropTypes.arrayOf(
                                            PropTypes.oneOfType(
                                                [PropTypes.string, PropTypes.object]
                                            )
                                        ),
                                        PropTypes.object
                                    ]),
    
    externalLink: PropTypes.string
};