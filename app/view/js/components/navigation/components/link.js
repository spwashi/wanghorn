import React from 'react'
import {NavLink} from "react-router-dom"

export const Link      = ({to, children, exact, activeClassName, className}) =>
    <NavLink to={to}
             exact={!!exact}
             className={className || ''}
             activeClassName={"active link_item--active " + (activeClassName || '')}>
        {children}
    </NavLink>;
export const Item      = ({activeClassName, to, as, className}) =>
    <li className={"navigation--link_item link_item " + (className || '')}>
        <Link to={to} activeClassName={activeClassName}>
            {as}
        </Link>
    </li>;
export const Container = ({children}) =>
    <ul className="navigation--link_container link_container">
        {children}
    </ul>;