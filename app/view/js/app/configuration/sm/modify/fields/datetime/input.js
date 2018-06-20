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
	       state     = {inputIsActive: undefined};
	       inputRef: HTMLElement;
	       valueRef: HTMLElement;

	render() {
		const {value, defaultValue, required, onChange} = this.props;

		const dateFormat  = 'ddd, MMM Do YYYY';
		const hourFormat  = 'h:mm a';
		const valueString = value ? value.format(`${dateFormat} \\a\\t ${hourFormat}`) : null;
		const activate    = e => {
			this.datetime && this.datetime.openCalendar();
			return !this.state.inputIsActive && this.setState({inputIsActive: true});
		};
		const deactivate  = e => {
			this.datetime && this.datetime.closeCalendar();
			return this.state.inputIsActive && this.setState({inputIsActive: false});
		};
		const inputProps  = {
			required,
			focused:   'focused',
			autoFocus: true
		};
		const input = () => <Datetime className={'field--input'}

		                              ref={e => this.datetime = e}
		                              value={value}
		                              defaultValue={defaultValue}

		                              open={this.state.inputIsActive}

		                              onFocus={e => activate()}
		                              onBlur={e => deactivate()}
		                              onChange={onChange}
		                              inputProps={inputProps}

		                              dateFormat={dateFormat}
		                              timeFormat={hourFormat}

		                              timeConstraints={{minutes: {step: 15}}}/>;

		return <InlineEditableInput value={valueString}
		                            input={input}

		                            setInputRef={el => this.inputRef = el}
		                            setValueRef={el => this.valueRef = el}

		                            isEdit={this.state.inputIsActive}
		                            activate={activate}
		                            deactivate={deactivate}/>;
	}
}