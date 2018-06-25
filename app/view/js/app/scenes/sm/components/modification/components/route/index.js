import React                                          from "react";
import PropTypes                                      from "prop-types";
import {Route, withRouter}                            from 'react-router-dom'
import {getReactPath, getURI}                         from "../../../../../../../path/resolution";
import {SmEntityModificationDialog}                   from "../dialog";
import {getSmEntityManagerFormats, parseSmID, isSmID} from "../../../../utility";
import {selectSmState, fromSm_selectSchematicOfSmID}  from "../../../../selector";
import {connect}                                      from "react-redux";


class Dialog extends React.Component {
	static propTypes = {
		match:              PropTypes.any.isRequired,
		history:            PropTypes.any.isRequired,
		sm:                 PropTypes.any.isRequired,
		intent:             PropTypes.string.isRequired,
		name:               PropTypes.any.isRequired,
		smID:               PropTypes.any.isRequired,
		formTitle:          PropTypes.any,
		resolveSmEntity:    PropTypes.func,
		closingUri:         PropTypes.any.isRequired,
		smEntityIdentifier: PropTypes.any.isRequired,
	};
	render() {
		let {match, history}                            = this.props;
		let {intent}                                    = this.props;
		let {sm, name, smID, resolveSmEntity}           = this.props;
		let {formTitle, closingUri, smEntityIdentifier} = this.props;
		if (!smID) name = match.params.name;

		const schematic      = fromSm_selectSchematicOfSmID(sm, {smID});
		const managerFormats = getSmEntityManagerFormats(smEntityIdentifier);
		const managerName    = managerFormats.managerName;

		smID       = smID || `${managerName}${name}`;
		closingUri = closingUri || getURI('dev--model', {name});

		if (!schematic) return ' ...loading';

		const smEntity = resolveSmEntity && resolveSmEntity({id: match.params.id});
		return <SmEntityModificationDialog smID={smID}
		                                   title={formTitle}
		                                   smEntity={smEntity}
		                                   closingUri={closingUri}
		                                   schematic={schematic}
		                                   history={history}
		                                   intent={intent}/>;
	}
}


@connect(mapState)
class ModificationRoute extends React.Component {
	static propTypes = {
		sm:                           PropTypes.object,
		resolveSmEntity:              PropTypes.func,
		onSubmissionResponseReceived: PropTypes.func,
		isEdit:                       PropTypes.bool,
		// A string that can identify this smEntity
		smEntityIdentifier:           PropTypes.string.isRequired,
		// Where to go when we close this modification/page
		closingUri:                   PropTypes.string,
		formTitle:                    PropTypes.string,
	};
	shouldComponentUpdate(props, state) {
		return (!(props.sm && props.sm.schematics)) || (props.location !== this.props.location);
	}
	render() {
		const editIsBroken = this.props.isEdit && !this.props.resolveSmEntity;
		return editIsBroken ? `Oops! Looks like we can't resolve this entity` : this.renderDialogRoute();

	}
	renderDialogRoute() {
		const intent       = this.props.isEdit ? 'edit' : 'create';
		const {lowercase}  = getSmEntityManagerFormats(this.props.smEntityIdentifier);
		const {smID, name} = ModificationRoute.resolveFromIdentifier(this.props.smEntityIdentifier);

		const fallback        = `${lowercase}--${intent}`;
		const reactPathName   = name ? `${name}--${intent}` : fallback;
		const reactPath       = getReactPath(reactPathName, null, {fallback});
		const dialogComponent = props => <Dialog {...props}
		                                         key={'dialog'}

		                                         resolveSmEntity={this.props.resolveSmEntity}
		                                         closingUri={this.props.closingUri}
		                                         formTitle={this.props.formTitle}
		                                         intent={this.props.isEdit ? 'edit' : 'create'}
		                                         sm={this.props.sm}

		                                         name={name}
		                                         smID={smID}

		                                         smEntityIdentifier={this.props.smEntityIdentifier}/>;
		return <Route path={reactPath} component={dialogComponent}/>;
	}
	static resolveFromIdentifier(smEntityIdentifier) {
		let smID, name;
		if (isSmID(smEntityIdentifier)) {
			const parsed = parseSmID(smEntityIdentifier);
			name         = parsed.name;
			smID         = smEntityIdentifier;
		}
		return {smID, name};
	}
}


export default withRouter(ModificationRoute);

function mapState(state) {
	const sm = selectSmState(state);
	return {sm};
}