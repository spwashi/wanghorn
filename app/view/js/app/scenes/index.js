import React from "react"
import Dev from "./dev";
import {PUBLIC__IMAGES} from "../../paths";
import {PageContent} from "../components/page";

export {Dev};

// Move these out later

export const Home    = () => {
    return (
        <PageContent pageTitle="Home" pageClass=".page--__--home">
            <div className="image--container">
                <img className="image center" src={`${PUBLIC__IMAGES}/` + 'smiley.png'} alt="Image" />
            </div>
        </PageContent>
    );
};
export const LinkOne = () => {
    return (
        <PageContent pageTitle="LinkOne" pageClass=".page--__--linkOne">
            <div className="image--container">
            
            </div>
        </PageContent>
    );
};
export const LinkTwo = () => {
    return (
        <PageContent pageTitle="LinkTwo" pageClass=".page--__--linkTwo">
            <div className="image--container">
            
            </div>
        </PageContent>
    );
};