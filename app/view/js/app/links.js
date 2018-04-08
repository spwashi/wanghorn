import React from "react";
import {LinkItem} from "../components";
import {ABOUT_ME, DEV, HOME} from "../paths";

// remember to add the appropriate route in ./routes
export const links = [
    <LinkItem key='Home' exact to={HOME.length ? HOME : '/'} as="Home" />,
    <LinkItem key='aboutMe' to={ABOUT_ME} as="About Me" />,
    <LinkItem key='Dev' to={DEV} as="Dev" />,
];