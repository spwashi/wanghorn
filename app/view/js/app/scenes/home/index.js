import React from "react"
import {PageContent} from "../../components/page";
import {ProfileImageContainer} from "./profile/image/container";
import ContentSection from "../../components/page/content/section";
import {LinkItem} from "../../../components/navigation";
import {ABOUT_ME} from "../../../paths";

const spwashi_site = "https://spwashi.com";

export const Home = () => {
    const intros = [
        "My name is William!",
        <div>I'm a dummy site that <a href={spwashi_site}>Sam Washington</a> uses to quickly deploy web sites and applications.</div>,
        '',
        <LinkItem to={`${ABOUT_ME}#to-do`}>I'm a work in progress!</LinkItem>
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
                        intros.map((intro, i) => typeof intro === 'string' ?
                                                 <p key={i}>{intro}</p> :
                                                 <div key={i}>{intro}</div>
                        )
                    }
                </section>
            </ContentSection>
        </PageContent>
    );
};