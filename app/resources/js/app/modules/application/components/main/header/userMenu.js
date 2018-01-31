import React, {Component} from "react"
import Button from "../../../../../components/button/index";
import {USER_LOGIN_PATH} from "../../../paths";

class UserMenu extends Component {
    constructor() {
        super();
        this.state = {
            isLoginActive: false
        }
    }
    
    render() {
        const activateLogin   = () => this.setState({isLoginActive: true});
        const deactivateLogin = () => this.setState({isLoginActive: false});
        
        const LoginInput = ({isLoginActive}) => {
            const loginForm   =
                      <div id="user_menu--login">
                          <form action={USER_LOGIN_PATH} method="POST">
                              <input type="text"
                                     name='username'
                                     id="user_menu--login--username"
                                     className="username" />
                              <input type="password"
                                     name='password'
                                     id="user_menu--login--password"
                                     className="password" />
                              <div className="user_menu--action_button--container action_button--container button--container">
                                  <Button className="user_menu--action_button login-button"
                                          label="Login"
                                          type="submit" />
                                  <Button className="user_menu--action_button cancel-button"
                                          label="Cancel"
                                          handleClick={deactivateLogin} />
                              </div>
                          </form>
                      </div>;
            const loginButton = <Button label="Login" handleClick={activateLogin} />;
            
            return isLoginActive ? loginForm : loginButton;
        };
        
        return (
            <div className="user_menu">
                <LoginInput isLoginActive={this.state.isLoginActive} />
            </div>
        );
    }
}

export default UserMenu