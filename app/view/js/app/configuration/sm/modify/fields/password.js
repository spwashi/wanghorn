import React           from "react";
import {PropertyInput} from "../../../../scenes/sm/components/modification/components/field/propertyInput";
import {Field}         from "../../../../../components/form/field/field";

const PASSWORD_NO_MATCH = 'Passwords do not match';

export class PasswordField extends React.Component {
    state = {verification: ''};
    
    render() {
        const onValueChange         = this.props.onValueChange;
        const schematic             = this.props.schematic;
        const name                  = schematic.name;
        const password              = this.props.value;
        const title                 = this.props.title;
        const message               = this.props.message;
        
        const verificationTitle     = 'Verify ' + title;
        const verificationName      = 'verify--' + name;
        const checkPropertyValidity = (schematic, password) => {
            const status  = this.state.verification === password;
            const message = !status ? PASSWORD_NO_MATCH : null;
            return {message, status};
        };
        return [
            <Field key={'password'} title={title} name={name}
                   message={message && message.message !== PASSWORD_NO_MATCH ? message : null}
                   input={<PropertyInput title={title}
                                         value={password}
                                         onValueChange={value => onValueChange(value, checkPropertyValidity)}
                                         schematic={schematic} />} />,
            <Field key={'verify--password'} title={verificationTitle} name={verificationName}
                   message={message && message.message === PASSWORD_NO_MATCH ? message : null}
                   input={<input placeholder={verificationTitle}
                                 type="password"
                                 name={verificationName}
                                 onChange={e => this.setState({verification: e.target.value}, () => onValueChange(password,
                                                                                                                  checkPropertyValidity))} />} />
        ];
    }
}