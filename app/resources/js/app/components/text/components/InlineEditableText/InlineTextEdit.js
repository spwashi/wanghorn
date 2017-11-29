import PropTypes from "prop-types";
import React, {Component} from "react";
import * as utility from '../../../../utility'

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
        const text         = this.props.text || '';
        const onBlur       = event => {this._onBlur(event.target.value, ...arguments)};
        
        const className = this.props.className;
        
        return (<input autoFocus
        
                       className={className}
        
                       type="text"
                       ref="input"
        
                       defaultValue={text}
        
                       onKeyDown={this._handleKeyDown.bind(this)}
                       onBlur={onBlur}
                       onChange={handleChange} />);
        
    }
}

InlineTextEdit.propTypes = {
    
    onBlur:        PropTypes.func,
    handleChange:  PropTypes.func,
    handleKeyDown: PropTypes.func,
    text:          PropTypes.string,
    
    className: PropTypes.string
};

export {InlineTextEdit};