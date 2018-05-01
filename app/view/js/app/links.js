import React from "react";
import {LinkItem} from "base-components";
import {getURI} from "../path/resolution";

// remember to add the appropriate route in ./routes
let linkNames      = [
    {
        name:  "home",
        exact: true,
        title: 'Home'
    },
    {
        name:  "about_me",
        title: 'About Me'
    },
    {
        name:  "gallery--home",
        title: 'Gallery'
    },
    {
        name:  "dev--home",
        title: 'Dev'
    },
];
export const links =
        linkNames.map(({name, exact, title}) => {
            return <LinkItem wrapper={p => <li{...p} />}
                             key={name}
                             exact={!!exact}
                             to={getURI(name, null, {root: ''})}>{title}</LinkItem>
        });