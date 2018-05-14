import React from "react"
import * as PropTypes from "prop-types"

export const UsernameInput             = ({value, onChange}) => <input key={'username'}
                                                                       placeholder={'Username'}
                                                                       type="text"
                                                                       autoFocus={true}
                                                                       name="username"
                                                                       value={value}
                                                                       onKeyDown={event => {
                                                                           event.keyCode === 32 && event.preventDefault();
                                                                       }}
                                                                       onChange={onChange} />;
export const PasswordInput             = ({value, onChange}) => <input key={'password'}
                                                                       placeholder={'Password'}
                                                                       type="password"
                                                                       name="password"
                                                                       value={value}
                                                                       onChange={onChange} />;
const FormMessage                      = ({name, message, status = 'error'}) => {
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
FormMessage.propTypes                  = {
    name:    PropTypes.string,
    status:  PropTypes.string,
    message: PropTypes.string,
};
export const UsernameAndPasswordInputs = function ({username = '', password = '', response, onUsernameChange, onPasswordChange}) {
    return [<div key={'username'} className="input--wrapper username--wrapper">
                <label htmlFor="username">Username:</label>
                <UsernameInput value={username || ''} onChange={event => onUsernameChange(event.target.value)} />
                <FormMessage name={'username'}
                             message={(response.username || {}).message}
                             status={(response.username || {}).status} />
            </div>,
            <div key={'password'} className="input--wrapper password--wrapper">
                <label htmlFor="password">Password:</label>
                <PasswordInput value={password || ''} onChange={event => onPasswordChange(event.target.value)} />
                <FormMessage name={'password'}
                             message={(response.password || {}).message}
                             status={(response.password || {}).status} />
            </div>];
};
