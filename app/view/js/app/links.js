import React from "react";
import {LinkItem} from "../components";
import {DEV, HOME, LINK_ONE, LINK_TWO} from "../paths";

export const links = [
    <LinkItem key='Home' exact to={HOME.length ? HOME : '/'} as="Home" />,
    <LinkItem key='LinkOne' to={LINK_ONE} as="Link One" />,
    <LinkItem key='LinkTwo' to={LINK_TWO} as="Link Two" />,
    <LinkItem key='Dev' to={DEV} as="Dev" />,
];