import React from "react"
import Dev from "./dev";
import {PageContent} from "../components/page";
import {Home} from "./home";

export {Dev};
export {Home};
// Move these out later
export const LinkTwo = () => {
    return (
        <PageContent pageTitle="LinkTwo" pageClass=".page--__--linkTwo">
            <div className="image--container">
            
            </div>
        </PageContent>
    );
};