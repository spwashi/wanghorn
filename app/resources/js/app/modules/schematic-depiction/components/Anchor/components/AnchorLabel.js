import React, {Component} from "react";
import * as utility from '../../../../../utility'
import {CHAR_CODES} from "../../../constants";

class EditAnchorLabel extends Component {
    _handleChange;
    _onBlur;
    _id;
    
    constructor(props) {
        super(props);
        this._id           = utility.randomString();
        this._handleChange = props.handleChange || (event => {});
        this._onBlur       = props.onBlur || (event => {});
    }
    
    handleKeyDown(event) {
        const charCode = event.keyCode;
        
        if (!charCode) return;
        
        switch (charCode) {
            case CHAR_CODES.SPACE:
                const value = (this.refs.input.value + '-');
                this.setInputValue(value);
                event.preventDefault();
                break;
        }
    }
    
    setInputValue(value) {
        this.refs.input && (this.refs.input.value = value);
    }
    
    render() {
        const handleChange = this._handleChange;
        const label        = this.props.label || '';
        
        const onBlur = event => {this._onBlur(event.target.value, ...arguments)};
        return (<input autoFocus className={"anchor--label"} type="text"
                       ref="input"
        
                       defaultValue={label}
        
                       onKeyDown={this.handleKeyDown.bind(this)}
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
    return !isEdit ? <div className="anchor--label">{label || ' '}</div> : <EditAnchorLabel label={label}
                                                                                            onBlur={onBlur}
                                                                                            handleChange={handleChange} />;
    
};

export default AnchorLabel;