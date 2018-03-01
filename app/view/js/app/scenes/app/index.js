import React from "react"
import {Route} from 'react-router-dom'
import {navLinks} from "./links";
import {routes} from "./routes";
import Application from "./components/app";

export const MainApplication = () => <Application links={navLinks} routes={routes} />;