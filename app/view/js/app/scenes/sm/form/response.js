import React from "react"
import * as PropTypes from "prop-types"

export let ApiResponseMessage = function ({message}) {
    const type = typeof message === 'object' ? (!message.success ? 'error' : 'success') : null;
    const text = typeof message === 'object' ? message.message : message;
    return <div className={"message " + (type ? (type + ' ' + type + '--message') : '')}>{text}</div>;
};

ApiResponseMessage.propTypes = {
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({success: PropTypes.bool, message: PropTypes.string})])
};