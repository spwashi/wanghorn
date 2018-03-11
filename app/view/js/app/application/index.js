import React from "react"
import {links} from "./links";
import {routes} from "./routes";
import Application from "../components/app";

export const MainApplication = () => <Application links={links} routes={routes} />;