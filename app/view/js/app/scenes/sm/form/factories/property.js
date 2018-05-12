import React from "react"
import * as PropTypes from "prop-types"
import {StandardSmProperty} from "../../creation/components/input";
import {getTitleFromPropName} from "../../../dev/modules/sm/utility";
import {Field} from "../../../../components/form/field/field";

export default class PropertyField extends React.Component {
    render() {
        const {config, value, name: fieldName} = this.props;
        const onValueChange                    = this.onValueChange.bind(this);
        
        const input   = <StandardSmProperty {...{config, value, onValueChange}} />;
        const title   = getTitleFromPropName(config.name);
        const message = this.renderMessage();
        return <Field title={title} name={fieldName} input={input} message={message} />
        
    }
    
    getPropertyValidityStatus = (propertyName, value) => true;
    
    onValueChange(value) {
        const smID      = this.props.config.smID;
        const fieldName = this.props.name;
        
        const validityStatus    = this.getPropertyValidityStatus(smID, value);
        const updateValueStatus = this.props.updateValueStatus;
        
        return updateValueStatus(fieldName, value, validityStatus) || true;
    }
    
    renderMessage() {
        const message        = this.props.message;
        const messageType    = typeof message === 'object' ? (!message.success ? 'error' : 'success') : null;
        const msgText        = typeof message === 'object' ? message.message : message;
        const messageElement = <div className={"message " + (messageType ? (messageType + ' ' + messageType + '--message') : '')}>{msgText}</div>;
        return messageElement;
    }
};
PropertyField.propTypes = {
    config:            PropTypes.object,
    updateValueStatus: PropTypes.func,
    value:             PropTypes.any,
    message:           PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};