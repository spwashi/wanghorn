import React from "react"
import {PageContent} from "../../components/page";
import {PUBLIC__IMAGES} from "../../../paths";
import {ProfileImageContainer} from "./profile/image/container";
import ContentSection from "../../components/page/content/section";

export const Home = () => {
    return (
        <PageContent pageTitle="Home" pageClass=".page--__--home">
            <ContentSection name={'profile'}>
                <ProfileImageContainer>
                    <img src={`${PUBLIC__IMAGES}/` + 'smiley.png'}
                         alt="Hey there!" />
                </ProfileImageContainer>
                <section className="about--me">
                    <div className="greeting">Hello!!!</div>
                    <p>
                        My name is William Wanghorn, and I'm a dummy site built by Sam Washington.
                        My main goal is to make it easy for Sam to quickly build and deploy web sites and applications!
                    </p>
                </section>
            </ContentSection>
        </PageContent>
    );
};