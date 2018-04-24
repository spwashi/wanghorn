import React from "react"
import * as PropTypes from "prop-types"
import {PasswordInput, UsernameInput} from "./inputs";
import bind from "bind-decorator";

const FormMessage = ({name, message, status = 'error'}) => {
    if (!message) return null;
    switch (status) {
        case 'error':
        case 'success':
            break;
        default:
            return <div></div>
    }
    return <div className={`form_message form_message--${status} ${name}--${status}`}>{message || null}</div>
};

FormMessage.propTypes = {
    name:    PropTypes.string,
    status:  PropTypes.string,
    message: PropTypes.string,
};

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
    handleUsernameChange(event) {
        this.setState({username: event.target.value});
    }
    
    @bind
    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }
    
    render() {
        const {handleSubmit} = this.props;
        let onSubmit         = event => {
            event.preventDefault();
            return handleSubmit({username: this.state.username, password: this.state.password});
        };
        let state            = this.state;
        let response         = (state.response || {}).data || {};
        return (
            <form onKeyDown={this.props.onKeyDown} key={'signup--form'} className={'signup--form'} onSubmit={onSubmit}>
                <div className="input--wrapper username--wrapper">
                    <label htmlFor="username">Username:</label>
                    <UsernameInput value={state.username}
                                   onChange={this.handleUsernameChange} />
                    <FormMessage name={'username'}
                                 message={(response.username || {}).message}
                                 status={(response.username || {}).status} />
                </div>
                <div className="input--wrapper password--wrapper">
                    <label htmlFor="password">Password:</label>
                    <PasswordInput value={state.password}
                                   onChange={this.handlePasswordChange} />
                    <FormMessage name={'password'}
                                 message={(response.password || {}).message}
                                 status={(response.password || {}).status} />
                </div>
                <div className="input--wrapper submit--wrapper">
                    <button type="submit">Submit</button>
                </div>
            </form>);
    }
}

SignupForm.propTypes = {
    handleSubmit: PropTypes.func,
    onKeyDown:    PropTypes.func,
    response:     PropTypes.object,
    username:     PropTypes.string,
    password:     PropTypes.string,
};