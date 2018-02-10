import React from "react"
import {Link} from "react-router-dom"
import {LinkContainer, LinkItem} from "../../../components/navigation/index";
import {ABOUT_PATH, APP_HOME, TOPICS_PATH} from "../../paths";

const Navigation = ({links}) =>
    <nav className="main main--navigation navigation">
        <LinkContainer>
            {links}
        </LinkContainer>
    </nav>;

export default Navigation