import React                  from "react";
import moment                 from "moment";
import {DefaultPropertyField} from "../../../../scenes/sm/components/form/components/field/smEntity/default";
import {Field}                from "base-components/form/field/field";
import Datetime               from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export class DatetimeField extends React.Component {
	static propTypes = {...DefaultPropertyField.propTypes};
	       state     = {};

	render() {
		let value = this.props.value;
		console.log(value);
		let nowString   = moment().format('ddd, MMM Do YYYY') + ' at ' + moment().format('h:mm a');
		let valueString = value ? moment(value).format('ddd, MMM Do YYYY') + ' at ' + moment().format('h:mm a') : null;
		let onChange    = e => {
			let val;
			if (e._isAMomentObject) {
				val = moment(e).format();
				this.props.onValueChange(val);
			}
		};
		let input       =
			    <div className={'field--input'}>
				    <Datetime value={valueString || nowString} onChange={onChange}/>
			    </div>;
		return <Field title={this.props.title} name={this.props.name} message={this.props.message} input={input}/>
	}
}