import React               from "react";
import PropTypes           from "prop-types";
import InlineEditableInput from "../input/inlineEditable";
import Datetime            from "react-datetime";
import "react-datetime/css/react-datetime.css"

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

		const input = () => <Datetime className={'field--input'}
		                              value={value}
		                              defaultValue={defaultValue}

		                              onBlur={e => this.setState({inputIsActive: false})}
		                              onChange={onChange}
		                              inputProps={{required, autoFocus: true}}

		                              dateFormat={dateFormat}
		                              timeFormat={hourFormat}

		                              timeConstraints={{minutes: {step: 15}}}/>;

		return <InlineEditableInput value={valueString}
		                            input={input}
		                            isEdit={this.state.inputIsActive}
		                            activate={e => this.setState({inputIsActive: true})}
		                            deactivate={e => this.setState({inputIsActive: false})}/>;
	}
}