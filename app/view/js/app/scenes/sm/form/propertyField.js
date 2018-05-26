import React from "react"
import * as PropTypes from "prop-types"
import {StandardSmProperty} from "../creation/components/input";
import {getTitleFromPropName} from "../../dev/modules/sm/utility";
import {Field} from "../../../components/form/field/field";
import {ApiResponseMessage} from "./response";
import {SmEntityPropertyAsSelect} from "../creation/components/select";

export default class PropertyField extends React.Component {
    state = {};
    
    constructor(props) {
        super(props);
        const schematic = this.props.schematic;
        if (schematic && schematic.datatypes && schematic.datatypes[0] === 'password') {
            this.state.verification        = '';
            this.getPropertyValidityStatus = ({smID}, value) => {
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
        const {schematic, value, name: fieldName} = this.props;
        
        const onValueChange          = this.onValueChange.bind(this);
        const title                  = getTitleFromPropName(schematic && schematic.name ? schematic.name : fieldName);
        const message                = this.renderMessage();
        let resolveSmEntitySchematic = this.props.resolveSmEntitySchematic;
        let resolveSmEntities        = this.props.resolveSmEntities;
        let primaryDatatype          = schematic.datatypes && schematic.datatypes[0];
        
        switch (primaryDatatype) {
            case 'password':
                const verificationTitle = 'Verify ' + title;
                const verificationName  = 'verify--' + fieldName;
                const onVerifyChange    = e => {
                    this.setState({verification: e.target.value}, () => onValueChange(value));
                };
                const verificationInput = <input placeholder={verificationTitle} type="password" name={verificationName} onChange={onVerifyChange} />;
                input                   = <StandardSmProperty title={title}
                                                              value={value}
                                                              onValueChange={onValueChange}
                                                              config={schematic} />;
                return [
                    <Field key={'password'} title={title} name={fieldName} input={input} message={message} />,
                    <Field key={'verify--password'} title={verificationTitle} name={verificationName} input={verificationInput} />
                ];
            default:
                input = schematic.reference ? <SmEntityPropertyAsSelect name={fieldName}
                                                                        value={value}
                                                                        key={'select'}
                                                                        onValueChange={onValueChange}
                                                                        schematic={schematic}
                                                                        resolveSmEntitySchematic={resolveSmEntitySchematic}
                                                                        resolveSmEntities={resolveSmEntities} />
                                            : <StandardSmProperty title={title}
                                                                  key={'property'}
                                                                  name={fieldName}
                                                                  value={value}
                                                                  onValueChange={onValueChange}
                                                                  config={schematic} />;
                return <Field key={fieldName} title={title} name={fieldName} input={input} message={message} />
        }
        
    }
    
    getPropertyValidityStatus = (identity, value) => true;
    
    onValueChange(value) {
        const schematic          = this.props.schematic;
        const fieldName          = this.props.name;
        const smID               = schematic.smID;
        const effectiveSchematic = {smID, fieldName, ...schematic};
        const validityStatus     = this.getPropertyValidityStatus(effectiveSchematic, value);
        const updateValueStatus  = this.props.updateValueStatus;
        
        return updateValueStatus(effectiveSchematic, value, validityStatus) || true;
    }
    
    renderMessage() {
        const message = this.props.message;
        return <ApiResponseMessage message={message} />;
    }
};
PropertyField.propTypes = {
    config:            PropTypes.object,
    updateValueStatus: PropTypes.func,
    
    resolveSmEntitySchematic: PropTypes.func.isRequired,
    resolveSmEntities:        PropTypes.func.isRequired,
    
    value:   PropTypes.any,
    message: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};