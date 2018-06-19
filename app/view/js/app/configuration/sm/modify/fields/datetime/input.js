import React               from "react";
import PropTypes           from "prop-types";
import "react-datetime/css/react-datetime.css"
import InlineEditableInput from "../input/inlineEditable";
import Datetime            from "react-datetime";

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