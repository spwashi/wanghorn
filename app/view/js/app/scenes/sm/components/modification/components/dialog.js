import React                                   from "react"
import * as PropTypes                          from "prop-types"
import bind                                    from "bind-decorator"
import {getNameFromSmID, getTitleFromPropName} from "../../../utility";
import {getURI}                                from "../../../../../../path/resolution";
import Modal                                   from "../../../../../components/modal/index";
import {SmEntityModificationForm}              from "./form";
import {navigateBackOnHistory}                 from "../../../../../components/modal/index";
import {withRouter}                            from "react-router-dom";

class SmEntityModificationDialog extends React.Component {
	state            = {isActive: true};
	static propTypes = {
		smID:       PropTypes.string.isRequired,
		title:      PropTypes.string,
		intent:     PropTypes.string.isRequired,
		// The URI to which we will navigate upon closing this modal dialog
		closingUri: PropTypes.string,
		schematic:  PropTypes.object.isRequired,
		smEntity:   PropTypes.object
	};
	render() {
		let {smID, schematic, title, smEntity} = this.props;
		const name                             = getNameFromSmID(this.props.smID);
		const onRequestClose                   = this.onRequestClose;
		const isOpen                           = this.state.isActive;
		const intent                           = this.props.intent;
		title                                  = title || `Create New ${getTitleFromPropName(name)}`;
		return (
			<Modal isOpen={isOpen} onRequestClose={onRequestClose} pageTitle={title} title={title} contentLabel={title}>
				<SmEntityModificationForm key={smID}
				                          intent={intent}
				                          smID={smID}
				                          smEntity={smEntity}
				                          schematic={schematic}/>
			</Modal>
		)
	};

	@bind
	onRequestClose() {
		this.setState({isActive: false});
		const history = this.props.history;
		const uri     = this.props.closingUri || getURI('home');
		return navigateBackOnHistory(history, uri);
	}
}

SmEntityModificationDialog = withRouter(SmEntityModificationDialog);
export {SmEntityModificationDialog};