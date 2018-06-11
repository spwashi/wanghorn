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
		return <SmEntityCreationForm contextName={'signup_process'}
		                             smID={'[Entity]user'}
		                             onSubmissionResponseReceived={({data, smEntity}) => {
			                             let user = data.message.user;
			                             user && this.props.handleActiveUserFound && this.props.handleActiveUserFound(user);
		                             }}
		                             smEntity={{name: 'User', properties: {username, password}}}
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