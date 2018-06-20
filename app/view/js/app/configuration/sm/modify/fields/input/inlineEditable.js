import React                   from "react";
import PropTypes               from "prop-types";
import withOutsideClickHandler from "react-click-outside";
class InlineEditableInput extends React.Component {
	state            = {isEdit: false};
	static propTypes = {
		children:    PropTypes.any,
		value:       PropTypes.any,
		setInputRef: PropTypes.func,
		setValueRef: PropTypes.func,
	};

	constructor(props) {
		super(props);
		this.state = {
			isEdit: props.isEdit || false
		}
	}
	handleClickOutside() {
		this.state.isEdit && this.toggleActivation(false);
	}
	componentDidUpdate() {
		if (this.state.isEdit !== this.props.isEdit) {
			this.setState({isEdit: this.props.isEdit});
		}
	}
	render() {
		const value       = this.props.value;
		const isEdit      = this.state.isEdit;
		const setInputRef = this.props.setInputRef || function () { };
		const setValueRef = this.props.setValueRef || function () { };
		const Input       = this.props.input;
		const input       = <Input/>;
		let onClick       = e => this.toggleActivation(true);
		let onKeyDown     = e => {
			if (e.keyCode === 27) {
				e.stopPropagation();
				this.toggleActivation(false)
			}
		};
		let edit          = (typeof isEdit === 'boolean' ? isEdit : this.state.isEdit);
		return (
			edit ? <div ref={setInputRef} className="inline-editable input" onKeyDown={onKeyDown}>{input}</div>
			     : <div ref={setValueRef} className="inline-editable value" tabIndex={0} onClick={onClick}>{value}</div>
		);
	}
	toggleActivation(isEdit) {
		isEdit = typeof isEdit !== "undefined" ? !!isEdit : !this.state.isEdit;
		this.state.isEdit !== isEdit && this.setState({isEdit: isEdit},
		                                              done => this.setActivation(isEdit));
	}
	setActivation(isEdit) {
		isEdit = typeof isEdit !== "undefined" ? !!isEdit : this.state.isEdit;
		isEdit ? this.props.activate && this.props.activate()
		       : this.props.deactivate && this.props.deactivate();
	}
}

export default withOutsideClickHandler(InlineEditableInput);