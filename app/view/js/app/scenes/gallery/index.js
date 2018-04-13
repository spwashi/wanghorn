import React from "react"
import {PageContent} from "../../components/page";
import GalleryItemContainer from "./components/item/galleryItemContainer";
import GalleryItem from "./components/item/galleryItem";
import GalleryItemFilterContainer from "./components/control/filter/filterContainer";
import SelectMultipleFilter from "./components/control/filter/selectMultipleFilter";

const categories = [
    'Category 1',
    'Category 2',
    'Category 3',
    'Category 4',
];
const Gallery       =
          props =>
              <PageContent pageTitle="Gallery" pageClass=".page--__--gallery">
                  <aside className="gallery_item--control">
                      <GalleryItemFilterContainer>
                          <h3>Filter</h3>
                          <SelectMultipleFilter categories={categories} />
                      </GalleryItemFilterContainer>
                  </aside>
                  <GalleryItemContainer>
                      <GalleryItem name={"Philip!"} externalLink={"https://github.com/spwashi/SmPHP"} price={4500}>
                          <div className="image philip" />
                      </GalleryItem>
                      <GalleryItem name={"William!"} externalLink={"https://github.com/spwashi/wanghorn"} price={4500}>
                          <div className="image william" />
                      </GalleryItem>
                      <GalleryItem name={"Jessica!"} externalLink={"https://github.com/spwashi/SmJS"} price={4500}>
                          <div className="image jessica" />
                      </GalleryItem>
                      <GalleryItem name={"other"} price={4500}>
                          <img src="http://lorempixel.com/g/400/200" alt="" />
                      </GalleryItem>
                      <GalleryItem name={"other"} price={4500}>
                          <img src="http://lorempixel.com/g/400/200" alt="" />
                      </GalleryItem>
                  </GalleryItemContainer>
              </PageContent>;

export default Gallery;