import React, {Component} from "react";
import * as utility from '../../../../../utility'
import {CHAR_CODES} from "../../../constants";

class EditAnchorLabel extends Component {
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

/**
 * Label for an Anchor
 *
 * @param props
 * @param {Function} props.onBlur
 * @param {Function} props.handleChange
 * @param {string}   props.label
 * @return {XML}
 * @constructor
 */
export const AnchorLabel = ({onBlur, handleChange, label, isEdit = false}) => {
    const className     = "anchor--label";
    const handleKeyDown = event => {
        const charCode = event.keyCode;
        
        if (!charCode) return;
        
        switch (charCode) {
            case CHAR_CODES.SPACE:
                const value = (this.refs.input.value + '-');
                this.setInputValue(value);
                event.preventDefault();
                break;
        }
    };
    
    if (!isEdit) {
        return (
            <div className={className}>
                {label || ' '}
            </div>);
    }
    
    return <EditAnchorLabel className={className}
                            handleKeyDown={handleKeyDown}
                            labelText={label}
                            onBlur={onBlur}
                            handleChange={handleChange} />;
};

export default AnchorLabel;