import React from "react"
import {Field} from "base-components/form/field/field";
import {StandardSmProperty} from "../../../scenes/sm/smEntity/creation/components/field/smProperty";
import {PropertyReferenceSelect} from "../../../scenes/sm/smEntity/creation/components/select";

export class PasswordField extends React.Component {
    state = {verification: ''};
    
    render() {
        const onValueChange         = this.props.onValueChange;
        const schematic             = this.props.schematic;
        const name                  = schematic.name;
        const value                 = this.props.value;
        const title                 = this.props.title;
        const message               = this.props.message;
        const verificationTitle     = 'Verify ' + title;
        const verificationName      = 'verify--' + name;
        const checkPropertyValidity = ({smID}, value) => {
            if (this.state.verification === value) {
                return {message: null, status: true};
            }
            return {
                message: 'Passwords do not match',
                status:  this.state.verification === value
            }
        };
        const onVerifyChange        = e => {
            this.setState({verification: e.target.value},
                          () => onValueChange(value, checkPropertyValidity));
        };
        const verification          = <input placeholder={verificationTitle}
                                             type="password"
                                             name={verificationName}
                                             onChange={onVerifyChange} />;
        const input                 = <StandardSmProperty title={title}
                                                          value={value}
                                                          onValueChange={onValueChange}
                                                          schematic={schematic} />;
        console.log(message);
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