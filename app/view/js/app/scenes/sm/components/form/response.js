import React from "react"
import * as PropTypes from "prop-types"

export let ApiResponseMessage = function ({message}) {
    let type;
    
    if (message && typeof message === 'object') {
        type = (message.success || message.status === true) ? 'success' : 'error';
    } else if (typeof message === "boolean") {
        type = message ? 'success' : 'error';
    } else {
        type = null;
    }
    
    const text = message && typeof message === 'object' ? message.message : message;
    return <div className={"message " + (type ? (type + ' ' + type + '--message') : '')}>{text}</div>;
};

ApiResponseMessage.propTypes = {
    message: PropTypes.oneOfType([PropTypes.string,
                                  PropTypes.bool,
                                  PropTypes.shape({
                                                      success: PropTypes.bool,
                                                      message: PropTypes.string
                                                  })])
};