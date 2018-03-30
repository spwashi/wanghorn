import React from "react";

import Logo from './logo/index';
import UserMenu from "./userMenu/index";
import Navigation from './navigation/index';
import {StdHeader} from "../../../../components/index";

export const Header =
                 ({links}) => {
                     const Nav = () => <Navigation links={links} />;
                     return <StdHeader Logo={Logo}
                                       Navigation={Nav}
                                       UserMenu={UserMenu} />;
                 };