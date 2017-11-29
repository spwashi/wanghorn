import React, {Component} from "react";
import PropTypes from 'prop-types';
import InlineTextEdit from "./InlineTextEdit";
import InlineTextDisplay from "./InlineTextDisplay";

const InlineEditableText = ({
                                className,
                                text,
                                isEdit = false,
    
                                handleKeyDown,
                                handleChange,
    
                                onBlur
                            }) => {
    return !isEdit ? <InlineTextDisplay className={className} text={text} /> : <InlineTextEdit className={className} text={text}
    
                                                                                               handleKeyDown={handleKeyDown}
                                                                                               handleChange={handleChange}
    
                                                                                               onBlur={onBlur} />;
    
};

InlineEditableText.propTypes = {
    isEdit: PropTypes.bool,
    
    onBlur:        PropTypes.func,
    handleChange:  PropTypes.func,
    handleKeyDown: PropTypes.func,
    text:          PropTypes.string,
    
    className: PropTypes.string
};

export {InlineEditableText}
export default InlineEditableText;