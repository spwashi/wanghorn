import React from 'react';
import PropTypes from 'prop-types'
import LogoContainer from "./components/logoContainer";

export const StdHeader = ({logo, navigation, userMenu}) =>
    <header className="header-standard">
        {logo}
        {navigation}
        {userMenu}
    </header>;

export {LogoContainer}

StdHeader.propTypes = {
    logo:       PropTypes.node,
    navigation: PropTypes.node.isRequired,
    userMenu:   PropTypes.element
};