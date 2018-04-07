import React from "react"
import {PageContent} from "../../components/page";
import {ProfileImageContainer} from "./profile/image/container";
import ContentSection from "../../components/page/content/section";

const spwashi_site = "https://spwashi.com";

export const Home = () => {
    const intros = [
        "My name is William!",
        <div>I'm a dummy site that <a href={spwashi_site}>Sam Washington</a> uses to quickly deploy web sites and applications.</div>,
        '',
        "I might not look like much now, but "
    ];
    return (
        <PageContent pageTitle="Home" pageClass=".page--__--home">
            <ContentSection name={'profile'}>
                <ProfileImageContainer>
                    <div className="image henry"></div>
                </ProfileImageContainer>
                <section className="about--me">
                    <div className="greeting">Hello!!!</div>
                    {
                        intros.map(intro => <p>{intro}</p>)
                    }
                </section>
            </ContentSection>
        </PageContent>
    );
};