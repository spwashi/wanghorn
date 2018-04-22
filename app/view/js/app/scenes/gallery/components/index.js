import React from "react"
import * as PropTypes from "prop-types"
import Item from "./item/item";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux'
import {from_gallery_selectAllTags, selectActiveGalleryItems} from "../selector";
import GalleryItemContainer from "./item/container";
import {activateTag, deactivateTag, fetchGalleryItems} from "../actions";
import ControlComponent from "./control/controlComponent";
import {CONTROL__SELECT_MULTIPLE} from "./control/constants";
import bind from "bind-decorator";

class Gallery extends React.Component {
    componentDidMount() {
        this.props.fetchGalleryItems();
    }
    
    @bind
    handleControlEvent(filterName, controlType, eventName, ...args) {
        const tag_prefix = 'tag:';
        switch (controlType) {
            case CONTROL__SELECT_MULTIPLE:
                const [selectItemName] = args;
                if (filterName.indexOf(tag_prefix) >= 0) {
                    const tagCategory                  = filterName.substr(tag_prefix.length);
                    const {activateTag, deactivateTag} = this.props;
                    const activationFunc               = eventName === 'ACTIVATE' ? activateTag
                                                                                  : (eventName === 'DEACTIVATE' ? deactivateTag
                                                                                                                : (function () {console.log(`missing prop -- ${eventName}`);}));
                    activationFunc.bind(this)({category: tagCategory, tag: selectItemName})
                }
                console.log(eventName, filterName, ' -- ', selectItemName);
        }
    }
    
    getFilters() {
        const tagEntries = Object.entries(this.props.tags);
        return tagEntries.map(
            ([index, items]) => {
                const name  = 'tag:' + index;
                const title = index.replace(/[-_]/g, ' ');
                return <ControlComponent key={name}
                                         controlType={CONTROL__SELECT_MULTIPLE}
                                         name={name}
                                         title={title}
                                         onControlEvent={this.handleControlEvent}
                                         items={items} />;
            });
        
    }
    
    render() {
        const {items} = this.props;
        const filters = this.getFilters();
        return (
            <div className="gallery">
                <aside className="gallery_item--container--control_component--container">
                    {filters}
                </aside>
                <GalleryItemContainer>
                    {
                        items.map(
                            (item, key) => {
                                let img = item.asPerson ? (item.img || <div className={`image ${item.asPerson.toLowerCase()}`} />)
                                                        : item.img;
                                
                                return <Item key={key} {...item} img={img} />;
                            })
                    }
                </GalleryItemContainer>
            </div>
        );
    };
}

Gallery.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
                            tags:
                                PropTypes.objectOf(
                                    PropTypes.arrayOf(
                                        PropTypes.oneOfType(
                                            [PropTypes.string, PropTypes.object]
                                        )
                                    )
                                )
                        })
    )
};

const mapState         = state => {
    const items = selectActiveGalleryItems(state);
    const tags  = from_gallery_selectAllTags(state);
    return {items, tags};
};
const mapDispatch      = dispatch => bindActionCreators({activateTag, deactivateTag, fetchGalleryItems}, dispatch);
const connectOnGallery = connect(mapState, mapDispatch);
export default connectOnGallery(Gallery);