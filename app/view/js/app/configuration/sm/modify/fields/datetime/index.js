import React                  from "react";
import moment                 from "moment";
import {DefaultPropertyField} from "../../../../../scenes/sm/components/modification/components/field/smEntity/default";
import {Field}                from "base-components/form/field/field";
import ValueRepresentation    from "../../../../../scenes/sm/components/modification/components/field/internal/valueRepresentationProxy";
import {DatetimeInput}        from "./input";

export class DatetimeField extends React.Component {
	static propTypes = {...DefaultPropertyField.propTypes};
	       state     = {};
	componentDidMount() {
		let str   = moment().toISOString(true).replace(/\.\d+/, '');
		let value = new ValueRepresentation(str, moment());
		this.props.setDefaultValue && this.props.setDefaultValue(value);
	}
	onChange =
		datetime => {
			if (!datetime.minute) return;
			datetime.minute(Math.round(datetime.minute() / 15) * 15).second(0);

			const valueString = datetime.toISOString(true).replace(/\.\d+/, '');
			const value       = new ValueRepresentation(valueString, datetime);

			this.props.onValueChange(value)
		};

	render() {
		const schematic = this.props.schematic;
		let value       = this.props.value;

		if (value instanceof ValueRepresentation) {
			value = value.internal;
		} else if (typeof value === 'string') {
			value = moment(value);
		}

		const input = <DatetimeInput value={value}
		                             defaultValue={moment(value || undefined)}
		                             onChange={this.onChange}
		                             required={!!(schematic && schematic.isRequired)}/>;

		return <Field title={this.props.title}
		              name={this.props.name}
		              message={this.props.message}
		              input={input}/>
	}
}