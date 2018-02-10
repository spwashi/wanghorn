import React from "react";

import {StdHeader} from "../../../../components/header/index";
import MainLogo from '../logo'
import MainNavigation from '../navigation'
import MainUserMenu from "./userMenu";

export const MainHeader =
                 ({links}) => {
                     const Navigation = () => <MainNavigation links={links} />;
                     return (
                         <StdHeader
                             Logo={MainLogo}
                             Navigation={Navigation}
                             UserMenu={MainUserMenu}
                         />);
                 };