import React           from "react"
import * as PropTypes  from "prop-types"
import {PropertyInput} from "../propertyInput";
import {Field}         from "../../../../../../../../components/form/field/field";

export class DefaultPropertyField extends React.Component {
    static propTypes = {
        title:         PropTypes.string,
        name:          PropTypes.string,
        value:         PropTypes.any,
        onValueChange: PropTypes.func,
        schematic:     PropTypes.object,
    };
    
    render() {
        return <Field title={this.props.title}
                      name={this.props.name}
                      message={this.props.message}
                      input={<PropertyInput title={this.props.title}
                                            key={'property'}
                                            name={this.props.name}
                                            value={this.props.value}
                                            onValueChange={this.props.onValueChange}
                                            schematic={this.props.schematic} />} />
    }
}