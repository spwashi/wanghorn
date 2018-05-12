import React from "react"
import * as PropTypes from "prop-types"
import {InputWrapper} from "../input";

export const Field = function ({title, name, input, message}) {
    return <InputWrapper title={title} name={name}>{input}{message}</InputWrapper>;
};

Field.propTypes = {
    title:   PropTypes.string,
    name:    PropTypes.string,
    input:   PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    message: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
};