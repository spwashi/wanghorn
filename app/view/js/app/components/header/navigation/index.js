import React from "react"
import {LinkContainer} from "base-components";

const Navigation = ({links}) =>
    <nav className="main main--navigation navigation">
        <LinkContainer>
            {links}
        </LinkContainer>
    </nav>;

export default Navigation