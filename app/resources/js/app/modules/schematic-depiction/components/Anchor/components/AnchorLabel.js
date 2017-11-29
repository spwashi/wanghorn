import React, {Component} from "react";
import * as utility from '../../../../../utility'
import {CHAR_CODES} from "../../../constants";
import {InlineEditableText} from "../../../../../components/text";

export const AnchorLabel = ({
                                onBlur,
                                handleChange,
                                label,
    
                                isEdit = false
                            }) => {
    
    const handleKeyDown = function (event) {
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
    
    return <InlineEditableText className="anchor--label"
                               handleChange={handleChange}
                               handleKeyDown={handleKeyDown}
                               text={label}
                               onBlur={onBlur}
                               isEdit={isEdit} />
};

export default AnchorLabel;