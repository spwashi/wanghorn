import React      from "react"
import SignupForm from "./signup";
import Modal      from "../../modal";
import Button     from "../../../../components/button";

export class UserMenuController extends React.Component {
	render() {
		const {
			      username,
			      password,
			      handleActiveUserFound,
			      activateLogin,
			      activateSignup,
			      isSignupActive = false,
			      onRequestClose,
			      onPropertyValueChange,
			      signupResponse
		      } = this.props;
		return (
			<div key={'user_menu--button--container'} className={'button--container login_action--button--container '}>
				<Button label="Login" handleClick={activateLogin}/>
				<Button label="Signup" handleClick={activateSignup}/>
				<Modal key={'signup--form--modal'}
				       onRequestClose={onRequestClose}
				       isOpen={isSignupActive}
				       title="Sign Up"
				       baseClassName={'signup--form--wrapper'}>
					<SignupForm handleActiveUserFound={handleActiveUserFound}
					            onPropertyValueChange={onPropertyValueChange}
					            response={signupResponse}
					            username={username}
					            password={password}/>
				</Modal>
			</div>
		);
	}
}