import React from "react"
import SignupForm from "./signup";
import Modal from "../../modal";
import Button from "../../../../components/button";

export const UserMenuController = function ({
                                                activateLogin, activateSignup, onRequestClose,
                                                onModalButtonCloseClick, onSignupSubmit, onSignupKeydown,
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
                            onKeyDown={onSignupKeydown}
                            response={state.signupResponse}
                            username={state.username}
                            password={state.password} />
            </Modal>
        </div>
    );
};