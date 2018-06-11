import React                           from "react"
import {USER_SIGNUP_PROCESS}           from "../../../../path/paths";
import "whatwg-fetch";
import bind                            from "bind-decorator"
import axios                           from "axios";
import {UserMenuController}            from "./controller";
import {selectActiveUser}              from "../../../services/session/selector";
import {connect}                       from "react-redux"
import {bindActionCreators}            from 'redux'
import {activeUserFound, attemptLogin} from "../../../services/session/actions";
import {getURI}                        from "../../../../path/resolution";
import {UserMenuLogin}                 from "./login";
import {markContextResolved}           from "../../../scenes/sm/actions/index";

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
class UserMenu extends React.Component {
	constructor() {
		super();
		this.state = {
			isLoginActive:  false, isSignupActive: false,
			username:       null, password: null,
			signupResponse: null, loginResponse: null
		}
	}

	componentWillReceiveProps(nextProps, nextContext) {
		if (this.state.isSignupActive && nextProps.location.pathname !== this.props.location.pathname) {
			this.setState({isSignupActive: false});
		}
	}

	componentWillMount() {
		let isExactlySignup     = this.props.location.pathname === getURI('user--signup');
		let signupInQueryString = this.props.location.search.indexOf('?signup') === 0;
		if (!this.state.isSignupActive && (isExactlySignup || signupInQueryString)) {
			this.setState({isSignupActive: true});
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
		const activeUser                                      = this.props.activeUser;
		const isLoginActive                                   = this.state.isLoginActive;
		const {username, password}                            = this.state;
		const state                                           = this.state;
		const {activateLogin, activateSignup, onRequestClose} = this;
		const userMenuActions                                 = {activateLogin, activateSignup, onRequestClose, state};
		const onPropertyValueChange                           = (name, value) => {
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
				{activeUser ? <LoggedInUserMenu activeUser={activeUser}/>
				            : isLoginActive ? <UserMenuLogin onPropertyValueChange={onPropertyValueChange}
				                                             username={username} password={password}
				                                             onSubmit={this.getHandleSubmit('login')}
				                                             onDeactivateAttempt={onRequestClose}/>
				                            : <UserMenuController onPropertyValueChange={onPropertyValueChange}
				                                                  isSignupActive={this.state.isSignupActive}
				                                                  signupResponse={this.state.signupResponse}
				                                                  username={username}
				                                                  password={password}
				                                                  handleActiveUserFound={user => this.props.dispatchActiveUserFound({user})}
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
			this.props.dispatchActiveUserFound({user: JSON.parse(json)})
		}
		if (contextElement) {
			let context = contextElement.innerText || contextElement.innerHTML;
			this.props.dispatchContextResolved({context: JSON.parse(context)});
		}
	}

	@bind
	activateLogin() {
		this.setState({isLoginActive: true});
	}

	@bind
	deactivate() {
		const wasSignupActive = this.state.isSignupActive;
		this.setState({isLoginActive: false, isSignupActive: false},
		              () => {
			              if (wasSignupActive) {
				              let accessedIndirectly = this.props.history.action === 'PUSH' || this.props.location !== getURI('user--signup');
				              (accessedIndirectly) ? this.props.history.goBack() : this.props.history.push(getURI('home'))
			              }
		              });
	}

	@bind
	onRequestClose() {
		this.deactivate();
	}

	@bind
	getHandleSubmit(type) {
		const {username, password} = this.state;

		return data => {
			switch (type) {
				case 'login':
					this.props.attemptLogin(data);
					break;
				case 'signup':
					axios.post(USER_SIGNUP_PROCESS, data)
					     .then(response => {
						     const responseData = response.data;
						     alert(JSON.stringify(responseData));
						     this.setState({signupResponse: responseData});
					     });
					break;
				default:
					return;
			}
		}
	}

	@bind
	activateSignup() {
		this.setState({isSignupActive: true});
		this.props.history.push('?signup');
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