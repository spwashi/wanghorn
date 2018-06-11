import React                  from "react"
import * as PropTypes         from "prop-types"
import {SmEntityCreationForm} from "../../../scenes/sm/components/form/creation/components/form";
import {getURI}               from "../../../../path/resolution";

export default class SignupForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {response: props.response}
	}

	render() {
		const {username, password, onPropertyValueChange} = this.props;

		const userEntity = {
			name:       'user',
			properties: {
				username,
				password: {
					properties: {password}
				}
			}
		};
		console.log(userEntity);
		const onResponseReceived = response => {
			const {data} = response;
			let user     = data.message.user;
			user && this.props.handleActiveUserFound && this.props.handleActiveUserFound(user);
		};

		return <SmEntityCreationForm contextName={'signup_process'}
		                             smID={'[Entity]user'}
		                             onSubmissionResponseReceived={onResponseReceived}
		                             smEntity={userEntity}
		                             onPropertyValueChange={onPropertyValueChange}
		                             uri={getURI('user--process_signup')}/>;
	}
}

SignupForm.propTypes = {
	handleActiveUserFound: PropTypes.func,
	onKeyDown:             PropTypes.func,
	response:              PropTypes.object,
	username:              PropTypes.string,
	password:              PropTypes.string,
};