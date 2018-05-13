import React from "react";
import {NavLinkItem} from "./components/header/navigation/navLinkItem";

// remember to add the appropriate route in ./routes
let linkNames = [
    {name: "home", exact: true},
    {name: "about_me"},
    {name: "gallery--home"},
    {
        name:     "dev--home",
        exact:    false,
        children: [
            {name: 'dev--models'}
        ]
    },
];

export const links = linkNames.map((item, i) => <NavLinkItem key={item.name || i} item={item} />);