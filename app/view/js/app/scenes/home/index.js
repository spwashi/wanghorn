import React from "react"
import {PageContent} from "../../components/application/page";
import {PUBLIC__IMAGES} from "../../paths";

export const Home = () => {
    return (
        <PageContent pageTitle="Home" pageClass=".page--__--home">
            <div className="image--container">
                <img className="image center" src={`${PUBLIC__IMAGES}/` + 'smiley.png'} alt="Image" />
            </div>
        </PageContent>
    );
};