import React from "react"
import * as PropTypes from "prop-types"
import bind from "bind-decorator";
import {getNameFromSmID} from "../../../../utility";
import {getURI} from "../../../../../../../path/resolution";
import Modal from "../../../../../../components/modal/index";
import {SmEntityCreationForm} from "./form";

export class CreateSmEntityDialog extends React.Component {
    state = {isActive: true};
    
    render() {
        const {smID, schematic, formUrl} = this.props;
        const title                      = `Create New ${smID}`;
        const name                       = getNameFromSmID(this.props.smID);
        const onRequestClose             = this.onRequestClose;
        const isOpen                     = this.state.isActive;
        return (
            <Modal isOpen={isOpen} onRequestClose={onRequestClose} title={title} contentLabel={title}>
                <SmEntityCreationForm key={smID} smID={smID} schematic={schematic} uri={formUrl} />
            </Modal>
        )
    };
    
    @bind
    onRequestClose() {
        const history = this.props.history;
        const name    = getNameFromSmID(this.props.smID);
        const devURI  = getURI('dev--model', {name}, {skipEmpty: true, asReactRoute: true});
        this.setState({isActive: false});
        return history.action === 'PUSH' ? history.goBack() : history.push(devURI);
    }
}

CreateSmEntityDialog.propTypes = {
    history:   PropTypes.object.isRequired,
    smID:      PropTypes.string.isRequired,
    schematic: PropTypes.object.isRequired
};