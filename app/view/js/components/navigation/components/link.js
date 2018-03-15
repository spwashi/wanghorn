import React from 'react'
import {NavLink} from "react-router-dom"

export const Link      = ({to, children, exact, activeClassName, className}) =>
    <NavLink to={to}
             exact={!!exact}
             className={className || ''}
             activeClassName={"active link_item--active " + (activeClassName || '')}>
        {children}
    </NavLink>;
export const Item      = ({exact, activeClassName, to, as, className}) =>
    <li className={"link_item navigation--link_item " + (className || '')}>
        <Link exact={exact} to={to} activeClassName={activeClassName}>
            {as}
        </Link>
    </li>;
export const Container = ({children}) =>
    <ul className="link_container navigation--link_container">
        {children}
    </ul>;