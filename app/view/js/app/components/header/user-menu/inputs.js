import React from "react"

export const UsernameInput = ({value, onChange}) => <input key={'username'}
                                                           type="text"
                                                           autoFocus={true}
                                                           name="username"
                                                           value={value}
                                                           onKeyDown={event => { console.log(event.keyCode);event.keyCode === 32 && event.preventDefault();}}
                                                           onChange={onChange} />;
export const PasswordInput = ({value, onChange}) => <input key={'password'}
                                                           type="password"
                                                           name="password"
                                                           value={value}
                                                           onChange={onChange} />;
