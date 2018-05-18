import React from 'react';
import * as PropTypes from "prop-types"
import LogoContainer from "./components/logoContainer";

export class StdHeader extends React.Component {
    static propTypes = {
        Logo:       PropTypes.func,
        UserMenu:   PropTypes.func,
        Navigation: PropTypes.func.isRequired,
        className:  PropTypes.string
    };
    
    render() {
        const {style, Logo, Navigation, UserMenu, className} = this.props;
        return (
            <header className={"header-standard " + (className ? className : '')} style={style}>
                <Logo />
                <Navigation history={this.props.history} />
                <UserMenu />
            </header>
        );
        
    }
}

export {LogoContainer}