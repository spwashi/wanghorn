import React from "react"
import * as PropTypes from "prop-types"
import {USER_LOGIN_PATH} from "../../../../path/paths";
import {Button} from "base-components";
import {UsernameAndPasswordInputs} from "./inputs";
import bind from "bind-decorator"

export class UserMenuLogin extends React.Component {
    state = {};
    
    @bind
    handleUsernameChange(event) {
        this.setState({username: event.target.value});
    }
    
    @bind
    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }
    
    @bind
    handleKeydown(event) {
        if (event.keyCode !== 27) return;
        this.props.onDeactivateAttempt()
    }
    
    render() {
        const {onSubmit, onDeactivateAttempt} = this.props;
        const response                        = this.props.response || {};
        const {username, password}            = this.state;
        let handleSubmit                      = event => {
            event.preventDefault();
            (onSubmit || function () {})({username, password});
        };
        return (
            <div id="user-menu--login" onKeyDown={this.handleKeydown}>
                <form action={USER_LOGIN_PATH} method="POST" onSubmit={handleSubmit}>
                    <div className="user-menu--input--container input--container text_input--container">
                        <UsernameAndPasswordInputs username={username} handleUsernameChange={this.handleUsernameChange}
                                                   response={(response || {})}
                                                   password={password} handlePasswordChange={this.handlePasswordChange} />
                    </div>
                    
                    <div className="action_button--container user-menu--action_button--container input--container button--container">
                        <Button className="action_button user-menu--action_button login-button"
                                label="Login"
                                type="submit" />
                        <Button className="action_button user-menu--action_button cancel-button"
                                label="Cancel"
                                handleClick={onDeactivateAttempt} />
                    </div>
                </form>
            </div>);
    }
}

UserMenuLogin.propTypes = {
    onDeactivateAttempt: PropTypes.func.isRequired,
    onSubmit:            PropTypes.func,
};