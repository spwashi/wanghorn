import React from "react"
import * as PropTypes from "prop-types"
import {InputWrapper} from "./wrapper";
import {ApiResponseMessage} from "../../../app/scenes/sm/components/form/response";

export const Field = function ({title, name, input, message}) {
    return (
        <InputWrapper title={title} name={name}>
            {input}
            <div className="message--wrapper">
                <ApiResponseMessage message={message} />
            </div>
        </InputWrapper>
    );
};

Field.propTypes = {
    title:   PropTypes.string,
    name:    PropTypes.string,
    input:   PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    message: PropTypes.oneOfType([PropTypes.object, PropTypes.bool, PropTypes.string])
};