import React from "react";
import {LinkItem} from "../components";
import {ABOUT_ME, DEV, GALLERY, HOME} from "../paths";

// remember to add the appropriate route in ./routes
export const links = [
    <LinkItem wrapper={p => <li{...p} />} key='Home' exact to={HOME.length ? HOME : '/'}>Home</LinkItem>,
    <LinkItem wrapper={p => <li{...p} />} key='aboutMe' to={ABOUT_ME}>About Me</LinkItem>,
    <LinkItem wrapper={p => <li{...p} />} key='gallery' to={GALLERY}>Gallery</LinkItem>,
    <LinkItem wrapper={p => <li{...p} />} key='Dev' to={DEV}>Dev Interface</LinkItem>,
];