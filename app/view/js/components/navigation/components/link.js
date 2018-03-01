import React from 'react'
import {NavLink} from "react-router-dom"

export const Item      = ({children, to, as}) =>
    <li className="navigation--link_item link_item">
        <NavLink to={to} exact activeClassName="active link_item--active">
            {as}
        </NavLink>
    </li>;
export const Container = ({children}) => <ul className="navigation--link_container link_container">{children}</ul>;