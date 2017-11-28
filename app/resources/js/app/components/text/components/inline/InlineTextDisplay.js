import PropTypes from 'prop-types';
import React, {Component} from "react";

const InlineTextDisplay = ({text, className}) => {
    return (
        <div className={className}>
            {text || ' '}
        </div>);
    
};

export {InlineTextDisplay};
export default InlineTextDisplay;