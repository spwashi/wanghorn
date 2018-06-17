import React                      from "react"
import * as PropTypes             from "prop-types"
import bind                       from "bind-decorator";
import {getNameFromSmID}          from "../../../utility";
import {getURI}                   from "../../../../../../path/resolution";
import Modal                      from "../../../../../components/modal/index";
import {SmEntityModificationForm} from "./form";
import {navigateBackOnHistory}    from "../../../../../components/modal/index";
import {withRouter}               from "react-router-dom";

class SmEntityModificationDialog extends React.Component {
	state            = {isActive: true};
	static propTypes = {
		smID:                         PropTypes.string.isRequired,
		title:                        PropTypes.string,
		formUrl:                      PropTypes.string,
		onSubmissionResponseReceived: PropTypes.func,
		closingUri:                   PropTypes.string,
		schematic:                    PropTypes.object.isRequired,
		smEntity:                     PropTypes.object
	};
	render() {
		let {smID, schematic, formUrl, title, smEntity, onSubmissionResponseReceived} = this.props;
		title                                                                         = title || `Create New ${smID}`;
		const name                                                                    = getNameFromSmID(this.props.smID);
		const onRequestClose                                                          = this.onRequestClose;
		const isOpen                                                                  = this.state.isActive;
		return (
			<Modal isOpen={isOpen} onRequestClose={onRequestClose} title={title} contentLabel={title}>
				<SmEntityModificationForm key={smID}
				                          onSubmissionResponseReceived={onSubmissionResponseReceived}
				                          smID={smID}
				                          smEntity={smEntity}
				                          schematic={schematic}
				                          uri={formUrl}/>
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