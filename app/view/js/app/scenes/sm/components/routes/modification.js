import React                                          from "react";
import PropTypes                                      from "prop-types";
import {Route, withRouter}                            from 'react-router-dom'
import {getReactPath, getURI}                         from "../../../../../path/resolution";
import {SmEntityModificationDialog}                   from "../modification/components/dialog";
import {getSmEntityManagerFormats, parseSmID, isSmID} from "./../../utility";
import {selectSmState, fromSm_selectSchematicOfSmID}  from "../../selector";
import {connect}                                      from "react-redux";


class Dialog extends React.Component {
	static propTypes = {
		match:                        PropTypes.any.isRequired,
		history:                      PropTypes.any.isRequired,
		sm:                           PropTypes.any.isRequired,
		action:                       PropTypes.string.isRequired,
		name:                         PropTypes.any.isRequired,
		smID:                         PropTypes.any.isRequired,
		formTitle:                    PropTypes.any,
		closingUri:                   PropTypes.any.isRequired,
		smEntityIdentifier:           PropTypes.any.isRequired,
		onSubmissionResponseReceived: PropTypes.any.isRequired,
	};
	render() {
		let {match, history}                            = this.props;
		let {action}                                    = this.props;
		let {sm, name, smID}                            = this.props;
		let {formTitle, closingUri, smEntityIdentifier} = this.props;
		let {onSubmissionResponseReceived}              = this.props;
		if (!smID) name = match.params.name;


		const schematic           = fromSm_selectSchematicOfSmID(sm, {smID});
		const managerFormats      = getSmEntityManagerFormats(smEntityIdentifier);
		const ownerType_lowercase = managerFormats.lowercase;
		const managerName         = managerFormats.managerName;
		const fallbackReceiveName = `${ownerType_lowercase}--${action}--receive`;


		smID = smID || `${managerName}${name}`;


		const getFormReceiveUriName = name => `${ownerType_lowercase}--${name}--${action}--receive`;
		const navigateUri           = getURI(getFormReceiveUriName(name), {name}, {fallback: fallbackReceiveName});

		if (!schematic) return ' ...loading';
		return <SmEntityModificationDialog smID={smID}
		                                   onSubmissionResponseReceived={onSubmissionResponseReceived}
		                                   title={formTitle}
		                                   closingUri={closingUri || getURI('dev--model', {name})}
		                                   formUrl={navigateUri}
		                                   schematic={schematic}
		                                   history={history}/>;
	}
}


@connect(mapState)
@withRouter
class ModificationRoute extends React.Component {
	static propTypes = {
		sm:                           PropTypes.object,
		onSubmissionResponseReceived: PropTypes.func,
		isEdit:                       PropTypes.bool,
		// A string that can identify this smEntity
		smEntityIdentifier:           PropTypes.string.isRequired,
		// Where to go when we close this modification/page
		closingUri:                   PropTypes.string,
	};
	shouldComponentUpdate(props, state) {
		return !(props.sm && props.sm.schematics) || (props.location !== this.props.location);
	}
	render() {
		let {smEntityIdentifier, closingUri}                = this.props;
		const {isEdit}                                      = this.props;
		const {sm, formTitle, onSubmissionResponseReceived} = this.props;
		const managerFormats                                = getSmEntityManagerFormats(smEntityIdentifier);
		const ownerType_lowercase                           = managerFormats.lowercase;
		const action                                        = isEdit ? 'edit' : 'create';
		const fallback                                      = `${ownerType_lowercase}--${action}`;
		const {smID, name}                                  = this.resolveFromIdentifier(smEntityIdentifier);
		const reactPathName                                 = name ? `${name}--${action}` : fallback;
		const reactPath                                     = getReactPath(reactPathName, null, {fallback});
		return <Route path={reactPath}
		              component={props => <Dialog key={'dialog'}
		                                          {...this.props}
		                                          closingUri={closingUri}
		                                          formTitle={formTitle}
		                                          action={isEdit ? 'edit' : 'create'}
		                                          name={name}
		                                          onSubmissionResponseReceived={onSubmissionResponseReceived}
		                                          sm={sm}
		                                          smID={smID} smEntityIdentifier={smEntityIdentifier}/>}/>;

	}
	resolveFromIdentifier(smEntityIdentifier) {
		let smID, name;
		if (isSmID(smEntityIdentifier)) {
			const parsed = parseSmID(smEntityIdentifier);
			name         = parsed.name;
			smID         = smEntityIdentifier;
		}
		return {smID, name};
	}
}


export default ModificationRoute;

function mapState(state) {
	const sm = selectSmState(state);
	return {sm};
}