import React from "react"
import * as PropTypes from "prop-types"

export const InputWrapper = ({title, name, message, children}) =>
    <div className={"input--wrapper " + name + '--wrapper'}>
        <label htmlFor={name}>{title}</label>
        {children}
    </div>;

InputWrapper.propTypes = {
    title:    PropTypes.string,
    name:     PropTypes.string,
    message:  PropTypes.string,
    children: PropTypes.any,
};