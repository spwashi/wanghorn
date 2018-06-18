import React     from "react";
import PropTypes from "prop-types";


class InlineEditableInput extends React.Component {
	state            = {isEdit: false};
	static propTypes = {
		children: PropTypes.any,
		value:    PropTypes.any,
	};
	render() {
		const value   = this.props.value;
		const isEdit  = this.props.isEdit;
		const Input   = this.props.input;
		const input   = <Input/>;
		let onClick   = e => this.toggleActivation();
		let onKeyDown = e => {
			if (e.keyCode === 27) {
				e.stopPropagation();
				this.setState({isEdit: false},
				              this.setActivation.bind(this));
			}
		};
		let edit      = (typeof isEdit === 'boolean' ? isEdit : this.state.isEdit);
		return (
			edit ? <div className="inline-editable input" onKeyDown={onKeyDown}>{input}</div>
			     : <div className="inline-editable value" tabIndex={0} onClick={onClick}>{value}</div>
		);
	}
	toggleActivation() {
		this.setState({isEdit: !this.isEdit}, () => this.setActivation());
	}
	setActivation() {
		this.state.isEdit ? this.props.activate && this.props.activate() : this.props.deactivate && this.props.deactivate();
	}
}
export default InlineEditableInput;