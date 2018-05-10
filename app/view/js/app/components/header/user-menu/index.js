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
    
    render() {
        let activeUser            = this.props.activeUser;
        let isLoginActive         = this.state.isLoginActive;
        const user_menu_classname = "user_menu " + (isLoginActive ? 'active' : '');
        const activateLogin       = this.activateLogin;
        const activateSignup      = this.activateSignup;
        const onRequestClose      = () => this.deactivate();
        const state               = this.state;
        const onSignupKeydown     = this.handleKeydown;
        const userSignupFormVars  = {
            activateLogin, activateSignup, onRequestClose,
            onSignupKeydown,
            state
        };
        return (
            <div className={user_menu_classname}>
                {activeUser ? <LoggedInUserMenu activeUser={activeUser} />
                            : isLoginActive ? <UserMenuLogin onSubmit={this.getHandleSubmit('login')} onDeactivateAttempt={onRequestClose} />
                                            : <UserMenuController onSignupSubmit={this.getHandleSubmit('signup')} {...userSignupFormVars} />}
            </div>
        );
    }
    
    componentDidMount() {
        const userElement = document.getElementById('session__user');
        if (userElement) {
            let json = userElement.innerText || userElement.innerHTML;
            //todo don't trust
            this.props.dispatchActiveUserFound(JSON.parse(json))
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
                              }, dispatch);
}