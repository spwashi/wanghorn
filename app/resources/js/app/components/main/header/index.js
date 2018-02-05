import React from "react";

import {StdHeader} from "../../../../components/header/index";
import mainLogo from '../logo'
import mainNavigation from '../navigation'
import UserMenu from "./userMenu";

export const mainHeader =
                 <StdHeader
                     logo={mainLogo}
                     navigation={mainNavigation}
                     userMenu={<UserMenu />} />;