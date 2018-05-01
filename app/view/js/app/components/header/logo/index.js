import React from "react"
import {LogoContainer} from "base-components"
import {HOME} from "../../../../path/paths";
import {Link} from "base-components/navigation/components/link";

const HeaderLogoContainer = () =>
    <LogoContainer>
        <Link to={HOME}>
            <div className="logo--item"></div>
        </Link>
    </LogoContainer>;

export default HeaderLogoContainer;