import PropTypes from 'prop-types';
import React, {Component} from "react";

const InlineTextDisplay = ({text, className}) => {
    return (
        <div className={className}>
            {text || ' '}
        </div>);
    
};

InlineTextDisplay.propTypes = {
    text:      PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    className: PropTypes.string
};

export {InlineTextDisplay};
export default InlineTextDisplay;