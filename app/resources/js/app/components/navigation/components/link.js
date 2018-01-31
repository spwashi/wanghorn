import React from 'react'
import {Link} from "react-router-dom"

export const Item      = ({children, to, as}) =>
    <li className="navigation--link_item link_item">
        <Link to={to}>
            {as}
        </Link>
    </li>;
export const Container = ({children}) => <ul className="navigation--link_container link_container">{children}</ul>;