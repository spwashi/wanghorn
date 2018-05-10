import React from "react"
import * as PropTypes from "prop-types"
import {UsernameAndPasswordInputs} from "./inputs";
import bind from "bind-decorator";

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
                <UsernameAndPasswordInputs username={this.state.username} handleUsernameChange={this.handleUsernameChange}
                                           response={response}
                                           password={this.state.password} handlePasswordChange={this.handlePasswordChange} />
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