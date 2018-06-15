import React                  from "react";
import moment                 from "moment";
import {DefaultPropertyField} from "../../../../scenes/sm/components/modification/components/field/smEntity/default";
import {Field}                from "base-components/form/field/field";
import Datetime               from "react-datetime/DateTime"
import "react-datetime/css/react-datetime.css"
import ValueRepresentation    from "../../../../scenes/sm/components/modification/components/field/internal/valueRepresentationProxy";

export class DatetimeField extends React.Component {
	static propTypes = {...DefaultPropertyField.propTypes};
	       state     = {};

	render() {
		let value          = this.props.value;
		value              = value instanceof ValueRepresentation ? value.internal : value;
		const onChange     = e => {
			if (!e.minute) return;
			e.minute(Math.round(e.minute() / 15) * 15).second(0);
			this.props.onValueChange(new ValueRepresentation(e.toISOString(true).replace(/\.\d+/, ''), e))
		};
		const schematic    = this.props.schematic;
		const defaultValue = moment(value || undefined);
		const required     = !!(schematic && schematic.isRequired);
		const input        = <Datetime value={value}
		                               className={'field--input'}
		                               dateFormat={'ddd, MMM Do YYYY'}
		                               timeFormat={'h:mm a'}
		                               timeConstraints={{minutes: {step: 15}}}
		                               defaultValue={defaultValue}
		                               inputProps={{required: required}}
		                               onChange={onChange}/>;
		return <Field title={this.props.title} name={this.props.name} message={this.props.message} input={input}/>
	}
}