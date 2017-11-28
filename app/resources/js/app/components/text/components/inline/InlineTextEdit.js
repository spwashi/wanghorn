import React, {Component} from "react";
import * as utility from '../../../../utility'
import {CHAR_CODES} from "constants";


export default class InlineTextEdit extends Component {
    _handleChange;
    _handleKeyDown;
    _onBlur;
    _id;
    
    constructor(props) {
        super(props);
        this._id            = utility.randomString();
        this._handleChange  = (props.handleChange || (event => {})).bind(this);
        this._handleKeyDown = (props.handleKeyDown || (event => {})).bind(this);
        this._onBlur        = (props.onBlur || (event => {})).bind(this);
    }
    
    setInputValue(value) {
        this.refs.input && (this.refs.input.value = value);
    }
    
    render() {
        const handleChange = this._handleChange;
        const labelText    = this.props.labelText || '';
        const onBlur       = event => {this._onBlur(event.target.value, ...arguments)};
        
        const className = this.props.className;
        
        return (<input autoFocus
        
                       className={className}
        
                       type="text"
                       ref="input"
        
                       defaultValue={labelText}
        
                       onKeyDown={this._handleKeyDown.bind(this)}
                       onBlur={onBlur}
                       onChange={handleChange} />);
        
    }
}
export {InlineTextEdit};