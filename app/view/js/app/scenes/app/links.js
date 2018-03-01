import React from "react";
import {LinkItem} from "../../../components/navigation";
import {ABOUT, HOME, TOPICS} from "../../paths";

export const navLinks = [
    <LinkItem key='HomePageLink' to={HOME.length ? HOME : '/'} as="Home" />,
    <LinkItem key='AboutPageLink' to={ABOUT} as="About" />,
    <LinkItem key='TopicsPageLink' to={TOPICS} as="Topics" />,
];