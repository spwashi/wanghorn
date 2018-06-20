import React                                                  from "react";
import {Route}                                                from 'react-router'
import {ABOUT_ME, DEV, EVENT_FALLBACK, EVENTS, GALLERY, HOME} from "../../path/paths";
import {AboutMePage, Dev, EventsPage, GalleryPage, Home}      from "../scenes/index";

// remember to add the appropriate link in ./links
export default props =>
	[
		<Route exact key='Home' path={HOME.length ? HOME : '/'} component={Home}/>,
		<Route exact key='LinkOne' path={ABOUT_ME} component={AboutMePage}/>,
		<Route key='Gallery' path={GALLERY} component={GalleryPage}/>,
		<Route key='Dev' path={DEV} component={Dev}/>,
		<Route key='Events' path={EVENTS} component={EventsPage}/>,
		<Route key='EventFallback' path={EVENT_FALLBACK} component={EventsPage}/>,
	];