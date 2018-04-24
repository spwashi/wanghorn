import React, {Component} from "react"
import {USER_LOGIN_PATH, USER_SIGNUP} from "../../../../paths";
import {Button} from "base-components";
import "whatwg-fetch";
import bind from "bind-decorator"
import axios from "axios";
import ReactModal from "react-modal";
import SignupForm from "./signup";
import {PasswordInput, UsernameInput} from "./inputs";

class UserMenu extends Component {
    constructor() {
        super();
        this.state = {
            isLoginActive:  false, isSignupActive: false,
            username:       null, password: null,
            signupResponse: null, loginResponse: null
        }
    }
    
    @bind
    activateLogin() {this.setState({isLoginActive: true});}
    
    @bind
    deactivate() {this.setState({isLoginActive: false, isSignupActive: false});}
    
    @bind
    getHandleSubmit(type) {
        return data => {
            let url;
            switch (type) {
                case 'login':
                    url = USER_LOGIN_PATH;
                    break;
                case 'signup':
                    url                      = USER_SIGNUP;
                    let {username, password} = data;
                    this.setState({username, password});
                    break;
                default:
                    return;
            }
            axios.post(url, data)
                 .then(response => {
                     const responseData = response.data;
                     alert(JSON.stringify(responseData));
                     switch (type) {
                         case 'login':
                             this.setState({loginResponse: responseData});
                             break;
                         case 'signup':
                             this.setState({signupResponse: responseData});
                             break;
                         default:
                             return;
                     }
                 });
        }
    }
    
    @bind
    handleKeydown(event) {
        console.log(event.keyCode);
        if (event.keyCode !== 27) return;
        this.deactivate()
    }
    
    @bind
    activateSignup() {
        this.setState({isSignupActive: true})
        
    }
    
    render() {
        const LoginInput = ({isLoginActive}) => {
            const LoginForm    = this.LoginForm;
            const LoginButtons = this.LoginButtons;
            
            return isLoginActive ? <LoginForm />
                                 : <LoginButtons />;
        };
        
        return (
            <div className={"user-menu " + (this.state.isLoginActive ? 'active' : '')}>
                <LoginInput isLoginActive={this.state.isLoginActive} />
            </div>
        );
    }
    
    @bind
    LoginButtons() {
        const onModalButtonCloseClick = event => this.setState({isSignupActive: false});
        let modalStatusClassNames     = {afterOpen: 'modal__-open', beforeClose: 'modal__-closing'};
        let modalClassNames           = {base: 'signup--form--wrapper modal--base', ...modalStatusClassNames};
        let modalOverlayClassNames    = {base: 'signup--form--wrapper--overlay modal--overlay', ...modalStatusClassNames};
        return (
            <div key={'user_menu--button--container'} className={'button--container login_action--button--container '}>
                <Button label="Login" handleClick={this.activateLogin} />
                <Button label="Signup" handleClick={this.activateSignup} />
                <ReactModal key={'signup--form--modal'}
                            onRequestClose={p => this.deactivate()}
                            isOpen={this.state.isSignupActive}
                            contentLabel="Sign Up" overlayClassName={modalOverlayClassNames} className={modalClassNames}>
                    <header>
                        <h2>Sign Up</h2>
                        <button tabIndex={0} className={'button__close modal--button__close'} onClick={onModalButtonCloseClick}>X</button>
                    </header>
                    <SignupForm handleSubmit={this.getHandleSubmit('signup')}
                                onKeyDown={this.handleKeydown}
                                response={this.state.signupResponse}
                                username={this.state.username}
                                password={this.state.password} />
                </ReactModal>
            </div>
        );
    }
    
    @bind
    UsernameInput() {
    
    }
    
    @bind
    PasswordInput() {
        return <input type="password" name="password" value={this.state.password} onChange={this.handlePasswordChange} />
    }
    
    @bind
    LoginForm() {
        return (
            <div id="user-menu--login" onKeyDown={this.handleKeydown}>
                <form action={USER_LOGIN_PATH} method="POST" onSubmit={this.getHandleSubmit('login')}>
                    <div className="user-menu--input--container input--container text_input--container">
                        <UsernameInput />
                        <PasswordInput />
                    </div>
                    
                    <div className="action_button--container user-menu--action_button--container input--container button--container">
                        <Button className="action_button user-menu--action_button login-button"
                                label="Login"
                                type="submit" />
                        <Button className="action_button user-menu--action_button cancel-button"
                                label="Cancel"
                                handleClick={this.deactivate} />
                    </div>
                </form>
            </div>);
    }
}

export default UserMenu