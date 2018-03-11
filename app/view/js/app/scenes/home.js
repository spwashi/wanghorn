import React from "react"
import {PageContent} from "../components/content/page";
import {PUBLIC__IMAGES} from "../application/paths";

export const Home = () => {
    return (
        <PageContent pageTitle="Home" pageClass=".page--__--home">
            <div className="image--container">
                <img className="image center" src={`${PUBLIC__IMAGES}/` + 'image-home.jpg'} alt="Image" />
            </div>
        </PageContent>
    );
};