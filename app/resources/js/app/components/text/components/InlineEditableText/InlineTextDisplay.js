import PropTypes from 'prop-types';
import React, {Component} from "react";
import {CHAR_CODES} from "../../../../modules/schematic-depiction/constants";

const InlineTextDisplay = ({text, className, setEditState = () => {}, setText}) => {
    
    const handleKeyDown = (event) => {
        const charCode = event.charCode || event.keyCode;
        switch (charCode) {
            case CHAR_CODES.BACKSPACE:
                setText('');
                break;
            
            case CHAR_CODES.SPACE:
                setEditState(true);
                
                break;
            
            case CHAR_CODES.TAB:
                return;
            
            default:
                setEditState(true);
                
                break;
        }
    };
    
    return (
        <div tabIndex={0} className={className} onKeyDown={handleKeyDown}>
            {text || ' '}
        </div>);
    
};

InlineTextDisplay.propTypes = {
    text:         PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    className:    PropTypes.string,
    setEditState: PropTypes.func,
    setText:      PropTypes.func
};

export {InlineTextDisplay};
export default InlineTextDisplay;