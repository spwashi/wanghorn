import React from "react"
import {LinkContainer} from "base-components";
import {NavLinkItem} from "./navLinkItem";

const Navigation = ({links}) =>
    <nav className="main main--navigation navigation">
        <LinkContainer>
            {links.map((item, i) => <NavLinkItem key={item.name || i} item={item} />)}
        </LinkContainer>
    </nav>;

export default Navigation