import React from "react"
import {PageContent} from "../../components/page";
import {PUBLIC__IMAGES} from "../../../paths";
import {ProfileImageContainer} from "./profile/image/container";

export const Home = () => {
    return (
        <PageContent pageTitle="Home" pageClass=".page--__--home">
            <ProfileImageContainer>
                <img src={`${PUBLIC__IMAGES}/` + 'smiley.png'}
                     alt="Hey there!" />
            </ProfileImageContainer>
        </PageContent>
    );
};