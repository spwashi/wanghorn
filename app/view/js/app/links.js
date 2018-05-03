import React from "react";
import {LinkItem} from "base-components";
import {getTitle, getURI} from "../path/resolution";

// remember to add the appropriate route in ./routes
let linkNames      = [
    {name: "home", exact: true},
    {name: "about_me"},
    {name: "gallery--home"},
    {name: "dev--home"},
];
export const links =
        linkNames.map(({name, exact}) => {
            let title = getTitle(name);
            return <LinkItem wrapper={p => <li{...p} />}
                             key={name}
                             exact={!!exact}
                             to={getURI(name, null, {root: ''})}>{title}</LinkItem>
        });