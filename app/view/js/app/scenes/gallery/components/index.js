import React from "react"
import * as PropTypes from "prop-types"
import GalleryItemContainer from "./item/galleryItemContainer";
import GalleryItemFilterContainer from "./control/filter/filterContainer";
import GalleryItem from "./item/galleryItem";
import SelectMultipleFilter from "./control/filter/selectMultipleFilter";

const getAvailableFiltersFromGalleryItems = galleryItems => {
    const mapItemToTagObject                 = item => {
        const itemTagObject = item.tags;
        
        if (!itemTagObject) return;
        if (Array.isArray(itemTagObject)) return;
        if (typeof  itemTagObject !== "object") return;
        return itemTagObject;
    };
    const reduceItemTagObjectIntoAll         =
              (allTagsByIndex, galleryItemTagObject) =>
                  Object.entries(galleryItemTagObject)
                        .reduce((all, tagEntry) => {
                            let [galleryIndex, tags] = tagEntry;
                            const merged             = [...(all[galleryIndex] || []), ...tags];
                            all[galleryIndex]        = [...new Set(merged)];
                            return all;
                        }, allTagsByIndex);
    const mapFilterIndexEntryToFilterWrapper =
              ([index, tags]) =>
                  <div key={JSON.stringify(tags)}>
                      <h3>{index}</h3>
                      <SelectMultipleFilter categories={tags} />
                  </div>;
    const galleryItemTagObjects              = galleryItems.map(mapItemToTagObject);
    const reducedTagsByFilterObj             = galleryItemTagObjects.reduce(reduceItemTagObjectIntoAll, {});
    return Object.entries(reducedTagsByFilterObj).map(mapFilterIndexEntryToFilterWrapper);
};
const Gallery                             = ({items}) => {
    const filters = getAvailableFiltersFromGalleryItems(items);
    
    return (
        <div className="gallery">
            <aside className="gallery_item--control">
                <GalleryItemFilterContainer>
                    {filters}
                </GalleryItemFilterContainer>
            </aside>
            <GalleryItemContainer>
                {items.map((item, key) => <GalleryItem key={key} {...item} />)}
            </GalleryItemContainer>
        </div>);
};
Gallery.propTypes                         = {
    items: PropTypes.arrayOf(PropTypes.shape({
                                                 tags: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string))
                                             })
    )
};
export default Gallery;
