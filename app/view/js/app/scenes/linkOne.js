import React from "react";
import {PageContent} from "../components/page/content";
import {PUBLIC__IMAGES} from "../application/paths";

export const LinkOne = () => {
    return (
        <PageContent pageTitle="LinkOne" pageClass=".page--__--linkOne">
            <div className="image--container">
                <img className="image center" src={`${PUBLIC__IMAGES}/` + 'image-one.jpg'} alt="Image" />
            </div>
        </PageContent>
    );
};