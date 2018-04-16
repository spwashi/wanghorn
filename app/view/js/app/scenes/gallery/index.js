import React from "react"
import Gallery from "./components";
import {PageContent} from "../../components/page";

class GalleryPage extends React.Component {
    render() {
        return (
            <PageContent pageTitle="Gallery" pageClass=".page--__--gallery">
                <Gallery />
            </PageContent>
        );
    }
}

export default GalleryPage