import React from "react";
import {PageContent} from "../components/page/content";
import {PUBLIC__IMAGES} from "../application/paths";

export const LinkTwo = () => {
    return (
        <PageContent pageTitle="LinkTwo" pageClass=".page--__--linkTwo">
            <div className="image--container">
                <img className="image center" src={`${PUBLIC__IMAGES}/` + 'image-two.jpg'} alt="Image" />
            </div>
        </PageContent>
    );
};