import React from "react"
import {LogoContainer} from "../../../../components"
import {HOME} from "../../../../paths";
import {Link} from "../../../../components/navigation/components/link";

const HeaderLogoContainer = () =>
    <LogoContainer>
        <Link to={HOME}>
            <div className="logo--item"></div>
        </Link>
    </LogoContainer>;

export default HeaderLogoContainer;