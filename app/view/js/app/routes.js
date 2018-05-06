import React from "react";
import {Route} from 'react-router-dom'
import {ABOUT_ME, DEV, GALLERY, HOME} from "../path/paths";
import {AboutMe, Dev, GalleryPage, Home} from "./scenes";

// remember to add the appropriate link in ./links
export const routes = [
    <Route exact key='Home' path={HOME.length ? HOME : '/'} component={Home} />,
    <Route exact key='LinkOne' path={ABOUT_ME} component={AboutMe} />,
    <Route key='Gallery' path={GALLERY} component={GalleryPage} />,
    <Route key='Dev' path={DEV} component={Dev} />,
];