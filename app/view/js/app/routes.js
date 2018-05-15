import React from "react";
import {Route} from 'react-router-dom'
import {ABOUT_ME, DEV, EVENTS, GALLERY, HOME} from "../path/paths";
import {AboutMePage, Dev, EventsPage, GalleryPage, Home} from "./scenes";

// remember to add the appropriate link in ./links
export const routes = [
    <Route exact key='Home' path={HOME.length ? HOME : '/'} component={Home} />,
    <Route exact key='LinkOne' path={ABOUT_ME} component={AboutMePage} />,
    <Route key='Gallery' path={GALLERY} component={GalleryPage} />,
    <Route key='Dev' path={DEV} component={Dev} />,
    <Route key='Events' path={EVENTS} component={EventsPage} />,
];