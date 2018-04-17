import React from "react"
import * as PropTypes from "prop-types"
import Item from "./item/item";
import {connect} from "react-redux";
import {selectGallery} from "../selector";
import GalleryItemContainer from "./item/container";
import SelectMultipleFilter from "./control/filter/selectMultipleFilter";
import GalleryItemFilterContainer from "./control/filter/filterContainer";
import {fetchGalleryItems} from "../actions";

const getAvailableFiltersFromGalleryItems =
          galleryItems => {
              const galleryItemTagObjects  = galleryItems.map(mapItemToTagObject);
              const reducedTagsByFilterObj = galleryItemTagObjects.reduce(reduceItemTagObjectIntoAll, {});
              return Object.entries(reducedTagsByFilterObj).map(mapFilterIndexEntryToFilterWrapper);
          };

class Gallery extends React.Component {
    componentDidMount() {
        this.props.dispatch(fetchGalleryItems());
    }
    
    render() {
        const {items} = this.props;
        const filters = getAvailableFiltersFromGalleryItems(items);
        return (
            <div className="gallery">
                <aside className="gallery_item--container--control">
                    <GalleryItemFilterContainer>{filters}</GalleryItemFilterContainer>
                </aside>
                <GalleryItemContainer>
                    {items.map((item, key) => <Item key={key} {...item} />)}
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
export default connect(
    state => {
        let {items} = selectGallery(state);
        return {items};
    }
)(Gallery);

// Helper functions

// Gets the "tag" object from an item
function mapItemToTagObject(item) {
    const itemTagObject = item.tags;
    
    if (!itemTagObject) return;
    if (Array.isArray(itemTagObject)) return;
    if (typeof  itemTagObject !== "object") return;
    return itemTagObject;
}

// Adds an item's tags into an object containing all tags indexed by category (or some other key)
function reduceItemTagObjectIntoAll(allTagsByIndex, galleryItemTagObject) {
    return Object.entries(galleryItemTagObject)
                 .reduce((all, tagEntry) => {
                     let [galleryIndex, tags] = tagEntry;
                     const merged             = [...(all[galleryIndex] || []), ...tags];
                     all[galleryIndex]        = [...new Set(merged)];
                     return all;
                 }, allTagsByIndex);
}

// Convert an entry from the overall tag object to an object containing a title and select
function mapFilterIndexEntryToFilterWrapper([index, tags]) {
    return (
        <div key={JSON.stringify(tags)}>
            <h3>{index}</h3>
            <SelectMultipleFilter categories={tags} />
        </div>
    );
}