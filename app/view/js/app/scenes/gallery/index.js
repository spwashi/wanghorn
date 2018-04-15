import React from "react"
import {PageContent} from "../../components/page";
import GalleryItemContainer from "./components/item/galleryItemContainer";
import GalleryItemFilterContainer from "./components/control/filter/filterContainer";
import GalleryItem from "./components/item/galleryItem";
import SelectMultipleFilter from "./components/control/filter/selectMultipleFilter";

const categories   = [
    'Category 1',
    'Category 2',
    'Category 3',
    'Category 4',
];
const galleryItems = [
    {
        name:         'Philip!',
        externalLink: "https://github.com/spwashi/SmPHP",
        price:        2015.2,
        tags:         {languages: ['PHP']},
        children:     <div className="image philip" />
    },
    {
        name:         'William',
        externalLink: "https://github.com/spwashi/wanghorn",
        price:        2015.2,
        tags:         {languages: ['PHP', 'ECMAScript']},
        children:     <div className="image william" />
    },
    {
        name:         'Jessica!',
        externalLink: "https://github.com/spwashi/SmJS",
        price:        2015.2,
        tags:         {languages: ['ECMAScript']},
        children:     <div className="image jessica" />
    },
];
const Gallery      =
          props => {
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
              const filters                            = Object.entries(reducedTagsByFilterObj).map(mapFilterIndexEntryToFilterWrapper);
        
              return (
                  <PageContent pageTitle="Gallery" pageClass=".page--__--gallery">
                      <aside className="gallery_item--control">
                          <GalleryItemFilterContainer>
                              {filters}
                          </GalleryItemFilterContainer>
                      </aside>
                      <GalleryItemContainer>
                          {galleryItems.map((item, key) => <GalleryItem key={key} {...item} />)}
                      </GalleryItemContainer>
                  </PageContent>
              );
          };

export default Gallery;