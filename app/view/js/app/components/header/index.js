import React from "react";
import * as PropTypes from "prop-types"

import Logo from './logo';
import UserMenu from "./user-menu";
import Navigation from './navigation';

export class Header extends React.Component {
    static propTypes = {
        links: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
        style: PropTypes.object,
    };
    
    render() {
        const {links, style, className} = this.props;
        return (
            <header className={"header-standard " + (className ? className : '')} style={style}>
                <Logo />
                <Navigation links={links} />
                <UserMenu />
            </header>
        )
    }
}