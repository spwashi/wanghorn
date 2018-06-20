import React from "react";

// remember to add the appropriate route in ./routes
export const links = [
    {name: "home", exact: true},
    {name: "about_me"},
    {name: "gallery--home"},
    {
        name:     "dev--home",
        exact:    false,
        children: [
            {name: 'dev--entities', exact: false},
            {name: 'dev--models', exact: false},
            {name: 'dev--routes', exact: false}
        ]
    },
    {name: "event--home"},
];