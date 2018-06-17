import React                                          from "react";
import PropTypes                                      from "prop-types";
import {Route, withRouter}                            from 'react-router-dom'
import {getReactPath, getURI}                         from "../../../../../path/resolution";
import {SmEntityModificationDialog}                   from "../modification/components/dialog";
import {getSmEntityManagerFormats, parseSmID, isSmID} from "./../../utility";
import {selectSmState, fromSm_selectSchematicOfSmID}  from "../../selector";
import {connect}                                      from "react-redux";


class SmEntityCreationDialog extends React.Component {
	static propTypes = {
		match:                        PropTypes.any.isRequired,
		history:                      PropTypes.any.isRequired,
		sm:                           PropTypes.any.isRequired,
		name:                         PropTypes.any.isRequired,
		smID:                         PropTypes.any.isRequired,
		formTitle:                    PropTypes.any,
		closingUri:                   PropTypes.any.isRequired,
		smEntityIdentifier:           PropTypes.any.isRequired,
		onSubmissionResponseReceived: PropTypes.any.isRequired,
	};
	render() {
		let {match, history}                            = this.props;
		let {sm, name, smID}                            = this.props;
		let {formTitle, closingUri, smEntityIdentifier} = this.props;
		let {onSubmissionResponseReceived}              = this.props;
		if (!smID) name = match.params.name;


		const schematic           = fromSm_selectSchematicOfSmID(sm, {smID});
		const managerFormats      = getSmEntityManagerFormats(smEntityIdentifier);
		const ownerType_lowercase = managerFormats.lowercase;
		const managerName         = managerFormats.managerName;
		const fallbackReceiveName = `${ownerType_lowercase}--create--receive`;


		smID = smID || `${managerName}${name}`;


		const getFormReceiveUriName = name => `${ownerType_lowercase}--${name}--create--receive`;
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
class CreationRoute extends React.Component {
	static propTypes = {
		sm:                           PropTypes.object,
		onSubmissionResponseReceived: PropTypes.func,
		// A string that can identify this smEntity
		smEntityIdentifier:           PropTypes.string.isRequired,
		// Where to go when we close this modification/page
		closingUri:                   PropTypes.string,
	};
	shouldComponentUpdate(props, state) {
		return !(props.sm && props.sm.schematics);
	}
	render() {
		let smID, name;
		let {smEntityIdentifier, closingUri}                = this.props;
		const {sm, formTitle, onSubmissionResponseReceived} = this.props;
		const managerFormats                                = getSmEntityManagerFormats(smEntityIdentifier);
		const ownerType_lowercase                           = managerFormats.lowercase;
		const fallback                                      = `${ownerType_lowercase}--create`;
		if (isSmID(smEntityIdentifier)) {
			const parsed = parseSmID(smEntityIdentifier);
			name         = parsed.name;
			smID         = smEntityIdentifier;
		}
		const reactPathName = name ? `${name}--create` : fallback;
		const reactPath     = getReactPath(reactPathName, null, {fallback: fallback});
		return <Route path={reactPath}
		              component={props => <SmEntityCreationDialog key={'dialog'}
		                                                          {...this.props}
		                                                          closingUri={closingUri}
		                                                          formTitle={formTitle}
		                                                          name={name}
		                                                          onSubmissionResponseReceived={onSubmissionResponseReceived}
		                                                          sm={sm}
		                                                          smID={smID} smEntityIdentifier={smEntityIdentifier}/>}/>;

	}
}


export default CreationRoute;

function mapState(state) {
	const sm = selectSmState(state);
	return {sm};
}