import React, {Component} from "react"
import {USER_SIGNUP_PROCESS} from "../../../../path/paths";
import "whatwg-fetch";
import bind from "bind-decorator"
import axios from "axios";
import {UserMenuController} from "./controller";
import {selectActiveUser} from "../../../services/session/selector";
import {connect} from "react-redux"
import {bindActionCreators} from 'redux'
import {activeUserFound, attemptLogin} from "../../../services/session/actions";
import {getURI} from "../../../../path/resolution";
import {UserMenuLogin} from "./login";
import {markContextResolved} from "../../../scenes/sm/actions";

const LoggedInUserMenu = function ({activeUser}) {
    return <div className="user_menu--link--container">
        <div className={'link--wrapper user--home--link--wrapper'}>
            <a href={getURI('home')}>{`Hello, ${activeUser.properties.username}`}</a>
        </div>
        <div className={'link--wrapper user--logout--link--wrapper'}>
            <a href={getURI('user--logout$')}>Log Out</a>
        </div>
    </div>;
};

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
    onUsernameChange(value) {
        this.setState({username: value});
    }
    
    @bind
    onPasswordChange(value) {
        this.setState({password: value});
    }
    
    render() {
        const activeUser = this.props.activeUser;
        
        const isLoginActive                   = this.state.isLoginActive;
        const {username, password}            = this.state;
        const state                           = this.state;
        const {activateLogin, activateSignup} = this;
        const onRequestClose                  = () => this.deactivate();
        const userMenuActions                 = {activateLogin, activateSignup, onRequestClose, state};
        const onPropertyValueChange           = (name, value) => {
            switch (name) {
                case '[Property]{[Entity]user}password':
                case 'password':
                    this.setState({password: value});
                    break;
                case '[Property]{[Entity]user}username':
                case 'username':
                    this.setState({username: value});
            }
        };
        return (
            <div className={"user_menu " + (isLoginActive ? 'active' : '')}>
                {activeUser ? <LoggedInUserMenu activeUser={activeUser} />
                            : isLoginActive ? <UserMenuLogin onPropertyValueChange={onPropertyValueChange}
                                                             username={username} password={password}
                                                             onSubmit={this.getHandleSubmit('login')}
                                                             onDeactivateAttempt={onRequestClose} />
                                            : <UserMenuController onPropertyValueChange={onPropertyValueChange}
                                                                  username={username} password={password}
                                                                  onSignupSubmit={this.getHandleSubmit('signup')}
                                                                  {...userMenuActions} />}
            </div>
        );
    }
    
    componentDidMount() {
        const userElement    = document.getElementById('session__user');
        const contextElement = document.getElementById('context__signup_process--configuration');
        //todo don't trust?
        if (userElement) {
            let json = userElement.innerText || userElement.innerHTML;
            this.props.dispatchActiveUserFound(JSON.parse(json))
        }
        let context = contextElement.innerText || contextElement.innerHTML;
        this.props.dispatchContextResolved(JSON.parse(context));
    }
    
    @bind
    activateLogin() {this.setState({isLoginActive: true});}
    
    @bind
    deactivate() {this.setState({isLoginActive: false, isSignupActive: false});}
    
    @bind
    getHandleSubmit(type) {
        const {username, password} = this.state;
        
        return data => {
            switch (type) {
                case 'login':
                    this.props.attemptLogin(data);
                    break;
                case 'signup':
                    let url = USER_SIGNUP_PROCESS;
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
    
    @bind
    LoginButtons() {
    
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
                                  attemptLogin,
                                  dispatchActiveUserFound: activeUserFound,
                                  dispatchContextResolved: markContextResolved
                              }, dispatch);
}