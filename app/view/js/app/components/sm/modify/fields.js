import React from "react"
import {Field} from "base-components/form/field/field";
import {StandardSmProperty} from "../../../scenes/sm/smEntity/creation/components/field/smProperty";
import {PropertyReferenceSelect} from "../../../scenes/sm/smEntity/creation/components/select/propertyReference";

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
            const message = !status ? 'Passwords do not match' : null;
            return {message, status};
        };
        const onVerifyChange        = e => {
            const onStateSet = () => onValueChange(password, checkPropertyValidity);
            this.setState({verification: e.target.value}, onStateSet);
        };
        const verification          = <input placeholder={verificationTitle}
                                             type="password"
                                             name={verificationName}
                                             onChange={onVerifyChange} />;
        const input                 = <StandardSmProperty title={title}
                                                          value={password}
                                                          onValueChange={value => onValueChange(value, checkPropertyValidity)}
                                                          schematic={schematic} />;
        return [
            <Field key={'password'}
                   title={title}
                   name={name}
                   input={input}
                   message={message} />,
            <Field key={'verify--password'}
                   title={verificationTitle}
                   name={verificationName}
                   input={verification} />
        ];
    }
}

export class PropertyReferenceField extends React.Component {
    render() {
        let input = <PropertyReferenceSelect name={this.props.name}
                                             value={this.props.value}
                                             key={'select'}
                                             onValueChange={this.props.onValueChange}
                                             schematic={this.props.schematic}
                                             resolveSmEntitySchematic={this.props.resolveSmEntitySchematic}
                                             resolveSmEntities={this.props.resolveSmEntities} />;
        return <Field title={this.props.title}
                      name={this.props.name}
                      message={this.props.message}
                      input={input} />
    }
}