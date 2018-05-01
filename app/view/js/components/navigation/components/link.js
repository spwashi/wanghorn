import * as PropTypes from "prop-types"
import React from 'react'
import {NavLink, Redirect} from "react-router-dom"

export class Link extends React.Component {
    render() {
        const {to, children, exact, activeClassName, className, redirect} = this.props;
        if (!!redirect) {
            return <Redirect push to={to}></Redirect>
        }
        console.log(to);
        return <NavLink to={to}
                        exact={!!exact}
                        className={className || ''}
                        activeClassName={"active link_item--active " + (activeClassName || '')}>
            {children}
        </NavLink>;
    }
};

Link.propTypes = {
    to:              PropTypes.string,
    exact:           PropTypes.bool,
    activeClassName: PropTypes.string,
    className:       PropTypes.string
};