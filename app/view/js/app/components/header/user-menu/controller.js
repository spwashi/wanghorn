import React from "react"
import SignupForm from "./signup";
import Modal from "../../modal";
import Button from "../../../../components/button";

export const UserMenuController = function ({
                                                username, password,
    
                                                activateLogin, activateSignup,
    
                                                onRequestClose, onModalButtonCloseClick, onSignupSubmit, onPropertyValueChange,
                                                state
                                            }) {
    return (
        <div key={'user_menu--button--container'} className={'button--container login_action--button--container '}>
            <Button label="Login" handleClick={activateLogin} />
            <Button label="Signup" handleClick={activateSignup} />
            <Modal key={'signup--form--modal'}
                   onRequestClose={onRequestClose}
                   isOpen={state.isSignupActive}
                   title="Sign Up"
                   baseClassName={'signup--form--wrapper'}>
                <SignupForm handleSubmit={onSignupSubmit}
                            onPropertyValueChange={onPropertyValueChange}
                            response={state.signupResponse}
                            username={username}
                            password={password} />
            </Modal>
        </div>
    );
};