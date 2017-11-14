import React, {Component} from "react";
import {Input} from '../../../../../components';

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
export const AnchorLabel = ({onBlur, handleChange, label, isEdit}) => {
    const labelText = label || '';
    onBlur          = onBlur || null;
    handleChange    = handleChange || null;
    isEdit          = isEdit || false;
    
    if (!isEdit) {
        return <span className="schema--anchor--label">
                    {labelText}
                </span>
    }
    
    return <Input autoFocus
                  className="schema--anchor--label"
                  type="text"
                  value={labelText}
    
                  handleChange={handleChange}
                  onBlur={onBlur} />;
};

export default AnchorLabel;