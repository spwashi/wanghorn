import React                  from "react";
import moment                 from "moment";
import {DefaultPropertyField} from "../../../../scenes/sm/components/modification/components/field/smEntity/default";
import {Field}                from "base-components/form/field/field";
import Datetime               from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export class DatetimeField extends React.Component {
	static propTypes = {...DefaultPropertyField.propTypes};
	       state     = {};

	render() {
		const value        = this.props.value;
		const nowString    = moment().format('ddd, MMM Do YYYY') + ' at ' + moment().format('h:mm a');
		const valueString  = value ? moment(value).format('ddd, MMM Do YYYY') + ' at ' + moment(value).format('h:mm a') : null;
		const onChange     = e => {
			let val;
			if (e._isAMomentObject) {
				val = moment(e).format();
				this.props.onValueChange(val);
			}
		};
		const schematic    = this.props.schematic;
		const timeString   = valueString || nowString;
		const defaultValue = moment(value || undefined);
		const required     = !!(schematic && schematic.isRequired);
		const input        =
			      <div className={'field--input'}>
				      <Datetime value={timeString}
				                defaultValue={defaultValue}
				                showTimeSelect={true}
				                inputProps={{required: required}}
				                onChange={onChange}/>
			      </div>;
		return <Field title={this.props.title} name={this.props.name} message={this.props.message} input={input}/>
	}
}