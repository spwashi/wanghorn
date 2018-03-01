import React from "react"
import {Link} from "react-router-dom"
import {LinkContainer, LinkItem} from "../../../components/navigation/index";
import {ABOUT, HOME, TOPICS} from "../../paths";

const Navigation = ({links}) =>
    <nav className="main main--navigation navigation">
        <LinkContainer>
            {links}
        </LinkContainer>
    </nav>;

export default Navigation