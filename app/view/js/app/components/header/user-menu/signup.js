import React                      from "react"
import * as PropTypes             from "prop-types"
import {SmEntityModificationForm} from "../../../scenes/sm/components/modification/components/form";

export default class SignupForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {response: props.response}
	}

	render() {
		const {onPropertyValueChange} = this.props;
		return <SmEntityModificationForm contextName={'signup_process'}
		                                 intent={'create'}
		                                 smID={'[Entity]user'}
		                                 smEntity={this.userEntity}
		                                 onPropertyValueChange={onPropertyValueChange}/>;
	}
	get userEntity() {
		const {username, password} = this.props;
		return {
			smID:       '[Entity]user',
			name:       'user',
			properties: {
				username,
				password: {
					properties: {password}
				}
			}
		};
	}
}
SignupForm.propTypes = {
	onKeyDown: PropTypes.func,
	response:  PropTypes.object,
	username:  PropTypes.string,
	password:  PropTypes.string,
};