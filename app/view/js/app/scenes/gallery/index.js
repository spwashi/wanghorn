import React from "react"
import {PageContent} from "../../components/page";
import Gallery from "./components";

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
        status:       'Active',
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
const GalleryPage  =
          props => {
              return (
                  <PageContent pageTitle="Gallery" pageClass=".page--__--gallery">
                      <Gallery items={galleryItems}></Gallery>
                  </PageContent>
              );
          };

export default GalleryPage;