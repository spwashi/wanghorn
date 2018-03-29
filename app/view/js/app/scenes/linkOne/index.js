import React from "react";
import {PageContent} from "../../components/page";
import {PUBLIC__IMAGES} from "../../paths";

export const LinkOne = () => {
    return (
        <PageContent pageTitle="LinkOne" pageClass=".page--__--linkOne">
            <div className="image--container">
                <img className="image center" src={`${PUBLIC__IMAGES}/` + 'image-one.jpg'} alt="Image" />
            </div>
        </PageContent>
    );
};