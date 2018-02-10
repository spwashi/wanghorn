import React from 'react';
import PropTypes from 'prop-types'
import LogoContainer from "./components/logoContainer";

export const StdHeader = ({Logo, Navigation, UserMenu}) =>
    <header className="header-standard">
        <Logo />
        <Navigation />
        <UserMenu />
    </header>;

export {LogoContainer}

StdHeader.propTypes = {
    Logo:       PropTypes.func,
    Navigation: PropTypes.func.isRequired,
    UserMenu:   PropTypes.func
};