import React from "react";
import {Field} from "../../../../../components/form/field/field";
import {PropertyReferenceSelect} from "../../../../scenes/sm/components/form/creation/components/select/propertyReference";

export class PropertyReferenceField extends React.Component {
    render() {
        return <Field title={this.props.title}
                      name={this.props.name}
                      message={this.props.message}
                      input={<PropertyReferenceSelect key={'select'}
                                                      name={this.props.name}
                                                      value={this.props.value}
                                                      onValueChange={this.props.onValueChange}
                                                      schematic={this.props.schematic}
                                                      resolveSmEntitySchematic={this.props.resolveSmEntitySchematic}
                                                      resolveSmEntities={this.props.resolveSmEntities} />} />
    }
}