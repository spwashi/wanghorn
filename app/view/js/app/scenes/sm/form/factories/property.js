import React from "react"
import * as PropTypes from "prop-types"
import {StandardSmProperty} from "../../creation/components/input";
import {getTitleFromPropName} from "../../../dev/modules/sm/utility";
import {Field} from "../../../../components/form/field/field";
import {ApiResponseMessage} from "../response";

export default class PropertyField extends React.Component {
    state = {};
    
    constructor(props) {
        super(props);
        const config = this.props.config;
        
        if (config.datatypes && config.datatypes[0] === 'password') {
            this.state.verification        = '';
            this.getPropertyValidityStatus = (smID, value) => {
                console.log(smID, value);
                if (this.state.verification === value) {
                    return {message: null, status: true};
                }
                return {
                    message: 'Passwords do not match',
                    status:  this.state.verification === value
                }
            }
        }
    }
    
    render() {
        let input;
        const {config, value, name: fieldName} = this.props;
        const onValueChange                    = this.onValueChange.bind(this);
        const title                            = getTitleFromPropName(config.name);
        const message                          = this.renderMessage();
        
        if (config.datatypes && config.datatypes[0] === 'password') {
            const verificationTitle = 'Verify ' + title;
            const verificationName  = 'verify--' + fieldName;
            const onVerifyChange    = e => {
                this.setState({verification: e.target.value}, () => onValueChange(value));
            };
            const verificationInput = <input type="password" name={verificationName} onChange={onVerifyChange} />;
            input                   = <StandardSmProperty {...{config, value, onValueChange}} />;
            return [
                <Field key={'password'} title={title} name={fieldName} input={input} message={message} />,
                <Field key={'verify--password'} title={verificationTitle} name={verificationName} input={verificationInput} />
            ]
        }
        
        input = <StandardSmProperty {...{config, value, onValueChange}} />;
        return <Field title={title} name={fieldName} input={input} message={message} />
        
    }
    
    getPropertyValidityStatus = (propertyName, value) => true;
    
    onValueChange(value) {
        const smID              = this.props.config.smID;
        const fieldName         = this.props.name;
        const validityStatus    = this.getPropertyValidityStatus(smID, value);
        const updateValueStatus = this.props.updateValueStatus;
        
        return updateValueStatus(fieldName, value, validityStatus) || true;
    }
    
    renderMessage() {
        const message = this.props.message;
        return <ApiResponseMessage message={message} />;
    }
};
PropertyField.propTypes = {
    config:            PropTypes.object,
    updateValueStatus: PropTypes.func,
    value:             PropTypes.any,
    message:           PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};