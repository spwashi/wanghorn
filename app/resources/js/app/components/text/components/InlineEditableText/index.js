import React, {Component} from "react";
import PropTypes from 'prop-types';
import InlineTextEdit from "./InlineTextEdit";
import InlineTextDisplay from "./InlineTextDisplay";

const InlineEditableText = ({
                                className,
                                text,
                                isEdit = false,
    
                                setEditState,
                                setText,
                            }) => {
    if (!isEdit) {
        return <InlineTextDisplay className={className}
                                  text={text}
                                  setEditState={setEditState} setText={setText} />;
    } else {
        return <InlineTextEdit className={className}
                               text={text}
                               setEditState={setEditState} setText={setText} />;
    }
    
};

InlineEditableText.propTypes = {
    className: PropTypes.string,
    text:      PropTypes.string,
    isEdit:    PropTypes.bool,
    
    handleChange: PropTypes.func,
    setEditState: PropTypes.func
    
};

export {InlineEditableText}
export default InlineEditableText;