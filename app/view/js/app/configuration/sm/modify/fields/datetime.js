import React                  from "react";
import PropTypes              from "prop-types";
import moment                 from "moment";
import {DefaultPropertyField} from "../../../../scenes/sm/components/modification/components/field/smEntity/default";
import {Field}                from "base-components/form/field/field";
import Datetime               from "react-datetime/DateTime"
import "react-datetime/css/react-datetime.css"
import ValueRepresentation    from "../../../../scenes/sm/components/modification/components/field/internal/valueRepresentationProxy";
import InlineEditableInput    from "./input/inlineEditable";

export class DatetimeInput extends React.Component {
	static propTypes = {
		value:        PropTypes.object,
		defaultValue: PropTypes.any.isRequired,
		required:     PropTypes.bool.isRequired,
		onChange:     PropTypes.func.isRequired,
	};
	       state     = {inputIsActive: null};
	render() {
		const {value, defaultValue, required, onChange} = this.props;

		const dateFormat  = 'ddd, MMM Do YYYY';
		const hourFormat  = 'h:mm a';
		const valueString = value ? value.format(`${dateFormat} \\a\\t ${hourFormat}`) : null;

		return (
			<InlineEditableInput value={valueString}
			                     input={() => <Datetime value={value}
			                                            onBlur={e => this.setState({inputIsActive: false}, () => console.log('here'))}
			                                            onChange={onChange}

			                                            className={'field--input'}
			                                            dateFormat={dateFormat}
			                                            timeFormat={hourFormat}
			                                            inputProps={{required, autoFocus: true}}
			                                            defaultValue={defaultValue}
			                                            timeConstraints={{minutes: {step: 15}}}/>}
			                     isEdit={this.state.inputIsActive}
			                     activate={e => this.setState({inputIsActive: true})}
			                     deactivate={e => this.setState({inputIsActive: false})}/>
		);
	}
}

export class DatetimeField extends React.Component {
	static propTypes = {...DefaultPropertyField.propTypes};
	       state     = {};
	componentDidMount() {
		let str   = moment().toISOString(true).replace(/\.\d+/, '');
		let value = new ValueRepresentation(str, moment());
		this.props.setDefaultValue && this.props.setDefaultValue(value);
	}
	onChange =
		e => {
			if (!e.minute) return;
			e.minute(Math.round(e.minute() / 15) * 15).second(0);
			let value = new ValueRepresentation(e.toISOString(true).replace(/\.\d+/, ''), e);
			this.props.onValueChange(value)
		};

	render() {
		let value = this.props.value;
		if (value instanceof ValueRepresentation) {
			value = value.internal;
		} else if (typeof value === 'string') {
			value = moment(value);
		}

		const schematic = this.props.schematic;
		const input     = <DatetimeInput value={value}
		                                 defaultValue={moment(value || undefined)}
		                                 onChange={this.onChange}
		                                 required={!!(schematic && schematic.isRequired)}/>;
		return <Field title={this.props.title}
		              name={this.props.name}
		              message={this.props.message}
		              input={input}/>
	}
}