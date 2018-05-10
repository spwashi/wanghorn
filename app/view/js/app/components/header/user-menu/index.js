import React, {Component} from "react"
import {USER_SIGNUP_PROCESS} from "../../../../path/paths";
import {Button} from "base-components";
import "whatwg-fetch";
import bind from "bind-decorator"
import axios from "axios";
import ReactModal from "react-modal";
import SignupForm from "./signup";
import {selectActiveUser} from "../../../scenes/dev/modules/session/selector";
import {connect} from "react-redux"
import {bindActionCreators} from 'redux'
import {attemptLogin} from "../../../scenes/dev/modules/session/actions";
import {UserMenuLogin} from "./login";
import {getURI} from "../../../../path/resolution";

@connect(mapState, mapDispatch)
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
            switch (type) {
                case 'login':
                    this.props.attemptLogin(data);
                    break;
                case 'signup':
                    let url                  = USER_SIGNUP_PROCESS;
                    let {username, password} = data;
                    this.setState({username, password});
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
                    break;
                default:
                    return;
            }
        }
    }
    
    @bind
    activateSignup() {
        this.setState({isSignupActive: true})
        
    }
    
    render() {
        
        const LoginInput = ({isLoginActive}) => {
            const LoginButtons = this.LoginButtons;
            if (this.props.activeUser) {
                let username = this.props.activeUser.properties.username;
                return <div className={'user--home--link--wrapper'}><a href={getURI('home')}>{`Hello, ${username}`}</a></div>;
            }
            return isLoginActive ? <UserMenuLogin onSubmit={this.getHandleSubmit('login')} onDeactivateAttempt={() => this.deactivate()} />
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
}

export default UserMenu;
function mapState(state) {
    return {
        activeUser: selectActiveUser(state)
    }
}

function mapDispatch(dispatch) {
    return bindActionCreators({
                                  attemptLogin
                              }, dispatch);
}