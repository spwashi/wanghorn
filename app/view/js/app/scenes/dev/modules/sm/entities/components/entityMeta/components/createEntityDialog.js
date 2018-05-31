import React from "react"
import * as PropTypes from "prop-types"
import {getNameFromSmID} from "../../../../utility";
import {getURI} from "../../../../../../../../../path/resolution";
import Modal from "../../../../../../../../components/modal";
import {SmEntityCreationForm} from "../../../../../../../sm/components/form/creation/components/form";

export class CreateEntityDialog extends React.Component {
    state = {isActive: true};
    
    render() {
        const {history}         = this.props;
        const {smID, schematic} = this.props;
        const entityName         = getNameFromSmID(this.props.smID);
        let onRequestClose      = () => {
            let devURI = getURI('dev--entity', {name: entityName}, {skipEmpty: true, asReactRoute: true});
            this.setState({isActive: false});
            return history.action === 'PUSH' ? history.goBack() : history.push(devURI);
        };
        let formUrl             = getURI("dev--create_entity--receive", {name: entityName});
        return (
            <Modal isOpen={this.state.isActive} onRequestClose={onRequestClose} title={`Create New ${smID}`} contentLabel="Create New">
                <SmEntityCreationForm key={smID} smID={smID} schematic={schematic} url={formUrl} />
            </Modal>
        )
    };
}

CreateEntityDialog.propTypes = {
    history: PropTypes.object,
    smID:    PropTypes.string,
    config:  PropTypes.object
};