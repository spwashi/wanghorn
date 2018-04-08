import * as PropTypes from "prop-types"
import React from 'react'
import {NavLink} from "react-router-dom"

export const Link = ({to, children, exact, activeClassName, className}) =>
    <NavLink to={to}
             exact={!!exact}
             className={className || ''}
             activeClassName={"active link_item--active " + (activeClassName || '')}>
        {children}
    </NavLink>;

Link.propTypes = {
    to:              PropTypes.string,
    exact:           PropTypes.bool,
    activeClassName: PropTypes.string,
    className:       PropTypes.string
};