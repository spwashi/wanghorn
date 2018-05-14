import * as PropTypes from "prop-types"
import React from 'react'
import {NavLink, Redirect} from "react-router-dom"

export class Link extends React.Component {
    state = {isFocused: false};
    
    render() {
        const {to, children, exact, isActive, activeClassName, redirect, ...props} = this.props;
        let {className}                                                            = this.props;
        className                                                                  = `${className || ''} ${this.state.isFocused ? 'focused' : ''}`;
        if (!!redirect) {
            return <Redirect push to={to}></Redirect>
        }
        
        const isActiveFn = typeof isActive === 'boolean' ? () => isActive
                                                         : isActive;
        return <NavLink to={to}
                        {...props}
                        onFocus={() => this.setState({isFocused: true}, this.props.onFocus)}
                        onBlur={() => this.setState({isFocused: false}, this.props.onBlur)}
                        exact={!!exact}
                        isActive={isActiveFn}
                        className={className || ''}
                        activeClassName={"active link_item--active " + (activeClassName || '')}>
            {children}
        </NavLink>;
    }
};

Link.propTypes = {
    to:              PropTypes.string,
    exact:           PropTypes.bool,
    isActive:        PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    activeClassName: PropTypes.string,
    className:       PropTypes.string
};