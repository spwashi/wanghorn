import React from "react";
import * as PropTypes from "prop-types"
import Logo from './logo';
import {withRouter} from "react-router"
import UserMenu from "./user-menu";
import Navigation from './navigation';

class Header extends React.Component {
    static propTypes = {
        links: PropTypes.arrayOf(PropTypes.object),
        style: PropTypes.object,
    };
    
    render() {
        const {links, style, className} = this.props;
        const {location, history}       = this.props;
        return (
            <header className={"header-standard " + (className ? className : '')} style={style}>
                <Logo />
                <Navigation links={links} />
                <UserMenu {...{history, location}} />
            </header>
        )
    }
}

Header = withRouter(Header);
export {Header}