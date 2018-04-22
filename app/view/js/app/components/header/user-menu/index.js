import React, {Component} from "react"
import {USER_LOGIN_PATH} from "../../../../paths";
import {Button} from "base-components";
import "whatwg-fetch";
import bind from "bind-decorator"

class UserMenu extends Component {
    constructor() {
        super();
        this.state = {isLoginActive: false}
    }
    
    @bind
    activate() {this.setState({isLoginActive: true});}
    
    @bind
    deactivate() {this.setState({isLoginActive: false});}
    
    handleSubmit(event) {
        event.preventDefault();
        
        const data = new FormData(event.target);
        
        fetch(USER_LOGIN_PATH,
              {
                  method: 'POST',
                  body:   data,
              });
    }
    
    @bind
    handleKeydown(event) {
        if (event.keyCode !== 27) return;
        
        this.deactivate()
    }
    
    render() {
        const LoginInput = ({isLoginActive}) => {
            const loginForm   =
                      <div id="user-menu--login" onKeyDown={this.handleKeydown}>
                          <form action={USER_LOGIN_PATH} method="POST" onSubmit={this.handleSubmit}>
                              <div className="user-menu--input--container input--container text_input--container">
                                  <input type="text"
                                         name='username'
                                         onKeyDown={event => event.keyCode === 32 && event.preventDefault()}
                                         id="user-menu--login--username"
                                         className="username" />
                                  <input type="password"
                                         name='password'
                                         id="user-menu--login--password"
                                         className="password" />
                              </div>
                        
                              <div className="action_button--container user-menu--action_button--container input--container button--container">
                                  <Button className="action_button user-menu--action_button login-button"
                                          label="Login"
                                          type="submit" />
                                  <Button className="action_button user-menu--action_button cancel-button"
                                          label="Cancel"
                                          handleClick={this.deactivate} />
                              </div>
                          </form>
                      </div>;
            const loginButton = <Button label="Login" handleClick={this.activate} />;
            
            return isLoginActive ? loginForm : loginButton;
        };
        
        return (
            <div className={"user-menu " + (this.state.isLoginActive ? 'active' : '')}>
                <LoginInput isLoginActive={this.state.isLoginActive} />
            </div>
        );
    }
}

export default UserMenu