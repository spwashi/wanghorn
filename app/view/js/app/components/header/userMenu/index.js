import React, {Component} from "react"
import {USER_LOGIN_PATH} from "../../../paths";
import {Button} from "../../../../components";
import "whatwg-fetch";

class UserMenu extends Component {
    constructor() {
        super();
        this.state = {isLoginActive: false}
    }
    
    handleSubmit(event) {
        event.preventDefault();
        
        const data = new FormData(event.target);
        
        fetch(USER_LOGIN_PATH,
              {
                  method: 'POST',
                  body:   data,
              });
    }
    
    render() {
        const activateLogin   = () => this.setState({isLoginActive: true});
        const deactivateLogin = () => this.setState({isLoginActive: false});
        
        const LoginInput = ({isLoginActive}) => {
            const loginForm   =
                      <div id="user-menu--login">
                          <form action={USER_LOGIN_PATH} method="POST" onSubmit={this.handleSubmit}>
                              <div className="user-menu--input--container input button--container">
                                  <input type="text"
                                         name='username'
                                         id="user-menu--login--username"
                                         className="username" />
                                  <input type="password"
                                         name='password'
                                         id="user-menu--login--password"
                                         className="password" />
                              </div>
                        
                              <div className="user-menu--action_button--container action_button--container button--container">
                                  <Button className="user-menu--action_button login-button"
                                          label="Login"
                                          type="submit" />
                                  <Button className="user-menu--action_button cancel-button"
                                          label="Cancel"
                                          handleClick={deactivateLogin} />
                              </div>
                          </form>
                      </div>;
            const loginButton = <Button label="Login" handleClick={activateLogin} />;
            
            return isLoginActive ? loginForm : loginButton;
        };
        
        return (
            <div className="user-menu">
                <LoginInput isLoginActive={this.state.isLoginActive} />
            </div>
        );
    }
}

export default UserMenu