import React from "react"
import * as PropTypes from "prop-types"
import {SmEntityCreationForm} from "../../../scenes/sm/creation/components/form";
import {getURI} from "../../../../path/resolution";

export default class SignupForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {response: props.response}
    }
    
    render() {
        const {username, password, onPropertyValueChange} = this.props;
        return <SmEntityCreationForm context={'signup_process'}
                                     smEntity={{properties: {username, password}}}
                                     onPropertyValueChange={onPropertyValueChange}
                                     config={'[Entity]user'}
                                     url={getURI('user--process_signup')} />;
    }
}

SignupForm.propTypes = {
    handleSubmit: PropTypes.func,
    onKeyDown:    PropTypes.func,
    response:     PropTypes.object,
    username:     PropTypes.string,
    password:     PropTypes.string,
};