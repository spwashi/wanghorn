export default class ValueRepresentation {
	_value;
	_internalValue;
	constructor(value, internalValue) {
		this._value         = value;
		this._internalValue = internalValue;
	}
	get value() {
		return this._value || this._internalValue;
	}
	get internal() {
		return this._internalValue;
	}
	toString() {
		return String(this._value)
	}
}