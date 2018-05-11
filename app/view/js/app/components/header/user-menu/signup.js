import React from "react"
import * as PropTypes from "prop-types"
import bind from "bind-decorator";
import {SmEntityCreationForm} from "../../../scenes/sm/creation/form";
import {getURI} from "../../../../path/resolution";

export default class SignupForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: props.username || '',
            password: props.password || '',
            response: props.response
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
        const {handleSubmit}       = this.props;
        let onSubmit               = event => {
            event.preventDefault();
            return handleSubmit({username: this.state.username, password: this.state.password});
        };
        const getHandler           = name => (event => this.setState({[name]: event.target.value}));
        let state                  = this.state;
        let response               = (state.response || {}).data || {};
        const {username, password} = this;
        let onPropertyValueChange  = (name, value, smID) => {
            if (name === 'username') {
                this.onUsernameChange(value);
            } else if (name === 'password') {
                this.onPasswordChange(value);
            }
        }; 
        return <SmEntityCreationForm context={'signup_process'}
                                     smEntity={{properties: {username, password}}}
                                     onPropertyValueChange={onPropertyValueChange}
                                     config={'[Entity]user'}
                                     url={getURI('user--process_signup')} />;
    }
}

SignupForm.propTypes = {
    handleSubmit: PropTypes.func,
    onKeyDown:    PropTypes.func,
    response:     PropTypes.object,
    username:     PropTypes.string,
    password:     PropTypes.string,
};