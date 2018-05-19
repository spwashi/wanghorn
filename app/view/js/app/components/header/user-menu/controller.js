import React from "react"
import SignupForm from "./signup";
import Modal from "../../modal";
import Button from "../../../../components/button";

export const UserMenuController = function ({
                                                username, password,
    
                                                activateLogin, activateSignup,
                                                isSignupActive = false,
                                                onRequestClose, onModalButtonCloseClick, onSignupSubmit, onPropertyValueChange,
                                                signupResponse
                                            }) {
    return (
        <div key={'user_menu--button--container'} className={'button--container login_action--button--container '}>
            <Button label="Login" handleClick={activateLogin} />
            <Button label="Signup" handleClick={activateSignup} />
            <Modal key={'signup--form--modal'}
                   onRequestClose={onRequestClose}
                   isOpen={isSignupActive}
                   title="Sign Up"
                   baseClassName={'signup--form--wrapper'}>
                <SignupForm handleSubmit={onSignupSubmit}
                            onPropertyValueChange={onPropertyValueChange}
                            response={signupResponse}
                            username={username}
                            password={password} />
            </Modal>
        </div>
    );
};