import React from "react";
import {PageContent} from "../../components/page";
import {PUBLIC__IMAGES} from "../../paths";

export const LinkTwo = () => {
    return (
        <PageContent pageTitle="LinkTwo" pageClass=".page--__--linkTwo">
            <div className="image--container">
                <img className="image center" src={`${PUBLIC__IMAGES}/` + 'image-two.jpg'} alt="Image" />
            </div>
        </PageContent>
    );
};