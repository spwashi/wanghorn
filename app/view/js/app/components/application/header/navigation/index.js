import React from "react"
import {Link} from "react-router-dom"
import {LinkContainer} from "../../../../../components/index";

const Navigation = ({links}) =>
    <nav className="main main--navigation navigation">
        <LinkContainer>
            {links}
        </LinkContainer>
    </nav>;

export default Navigation