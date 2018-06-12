import React from "react"
import * as PropTypes from "prop-types"

export let ApiResponseMessage = function ({message}) {
    let type;
    let text;
    if (message && typeof message === 'object') {
        
        while (typeof message !== "undefined") {
            text = message;
            if (typeof  type === 'undefined' && (typeof message.success !== "undefined" || message.status === true)) {
                type = (message.success || message.status === true) ? 'success' : 'error'
            }
            
            message = (message.message === null ? '' : (message.message || false)) || (message._message === null ? '' : message._message);
            text    = (typeof message === 'object' || typeof message === 'undefined') ? (typeof text === 'string' ? text : '')
                                                                                      : (message || text);
        }
        
    } else {
        if (typeof message === "boolean") {
            type = message ? 'success' : 'error';
        } else {
            type = null;
        }
        text = message;
    }
    return <div className={"message " + (type ? (type + ' ' + type + '--message') : '')}>{text}</div>;
};

ApiResponseMessage.propTypes = {
    message: PropTypes.oneOfType([PropTypes.string,
                                  PropTypes.bool,
                                  PropTypes.shape({
                                                      success: PropTypes.bool,
                                                      message: PropTypes.string
                                                  }),
                                  PropTypes.shape({
                                                      _message: PropTypes.string
                                                  })])
};