import React from "react";

import Logo from './logo';
import UserMenu from "./user-menu";
import Navigation from './navigation';
import {StdHeader} from "../../../components";

export const Header =
                 ({links}) => {
                     const Nav = () => <Navigation links={links} />;
                     return <StdHeader Logo={Logo}
                                       Navigation={Nav}
                                       UserMenu={UserMenu} />;
                 };