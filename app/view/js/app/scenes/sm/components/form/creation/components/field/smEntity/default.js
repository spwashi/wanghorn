import React from "react";
import {PropertyInput} from "../propertyInput";
import {Field} from "../../../../../../../../../components/form/field/field";

export class DefaultPropertyField extends React.Component {
    render() {
        let input = <PropertyInput title={this.props.title}
                                   key={'property'}
                                   name={this.props.name}
                                   value={this.props.value}
                                   onValueChange={this.props.onValueChange}
                                   schematic={this.props.schematic} />;
        return <Field title={this.props.title}
                      name={this.props.name}
                      message={this.props.message}
                      input={input} />
    }
}