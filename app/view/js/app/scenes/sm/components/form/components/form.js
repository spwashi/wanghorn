import React                                                    from "react"
import * as PropTypes                                           from "prop-types"
import bind                                                     from "bind-decorator";
import {bindActionCreators}                                     from "redux"
import axios                                                    from "axios";
import {reduceEntriesIntoObject}                                from "../../../../../../utility";
import {connect}                                                from "react-redux";
import {SmEntityFieldset}                                       from "./field/fieldset";
import {normalizeSmID}                                          from "../../../utility";
import {ApiResponseMessage}                                     from "../../../../../../components/form/response";
import {fetchModels}                                            from "../../../modules/models/actions/index";
import {fromSm_selectItemsOfSmID, fromSm_selectSchematicOfSmID} from "../../../selector";


@connect(mapState, mapDispatch)
class SmEntityModificationForm extends React.Component {
	state     = {hasSoughtSchematic: null, schematic: null};
	static propTypes = {
		uri:                          PropTypes.string.isRequired,
		contextName:                  PropTypes.string,
		onSubmissionResponseReceived: PropTypes.func,
		smEntity:                     PropTypes.object,
		onPropertyValueChange:        PropTypes.func,
		smID:                         PropTypes.string,
		schematic:                    PropTypes.object
	};

	constructor(props) {
		super(props);
		this.state                 = {
			status:     null,
			properties: {},
			messages:   {},
			schematic:  this.schematic || null
		};
		this.propertyChangeHandler = this.props.onPropertyValueChange || function () {
		};
	}

	// LIFECYCLE

	componentDidMount() {
		if (this.state.schematic || this.state.hasSoughtSchematic) {
			return;
		}

		let smEntity          = this.props.smEntity && this.props.smEntity.smID ? this.props.smEntity : {};
		let schematic         = this.props.schematic || {};
		let smID              = (schematic && schematic.smID) || (smEntity && smEntity.smID) || this.props.smID;
		let contextName       = this.props.contextName;
		let schematicResolved = fromSm_selectSchematicOfSmID(this.props.sm, {smID, contextName});
		schematic             = (schematicResolved && schematicResolved.smID ? schematicResolved : this.state.schematic);

		if (schematic && schematic.smID) {
			smEntity.smID = (smEntity && smEntity.smID) || schematic.smID;
		}

		this.setState({
			              hasSoughtSchematic: true,
			              schematic,
			              smEntity
		              })
	}
	render() {
		const status    = this.state.status;
		const schematic = this.state.schematic;
		if (!schematic) return schematic === false ? 'Cannot prompt for SmEntityCreation' : 'loading...';
		const {properties} = schematic;

		if (!properties) {
			console.error(this.state.schematic, this.props.schematic);
			throw new Error("Can only prompt for SmEntities that have Properties");
		}

		const resolveSmEntities        = this.resolveSmEntities;
		const resolveSmEntitySchematic = this.resolveSmEntitySchematic;
		return (
			<form onSubmit={this.handleSubmit} className={status ? 'status__' + status : ''}>
				<SmEntityFieldset schematic={schematic}
				                  messages={this.state.message}
				                  smEntity={this.effectiveSmEntity}
				                  resolveSmEntities={resolveSmEntities}
				                  updatePropertyValueStatus={this.updatePropertyValueStatus.bind(this)}
				                  resolveSmEntitySchematic={resolveSmEntitySchematic}>
				</SmEntityFieldset>
				<div className="message--wrapper">
					<ApiResponseMessage message={this.state.message}/>
				</div>
				<button type="submit">Submit</button>
			</form>
		);
	}

	// RESOLUTION

	resolveSmEntities        = item => {
		const smID = typeof item === "object" && item ? item.smID : (typeof  item === 'string' ? item : null);
		if (!smID) return;
		return fromSm_selectItemsOfSmID(this.props.sm, {smID});
	};
	resolveSmEntitySchematic = item => {
		const smID = typeof item === "object" && item ? item.smID : (typeof  item === 'string' ? item : null);
		if (!smID) return;
		return fromSm_selectSchematicOfSmID(this.props.sm, {smID});
	};

	// GETTERS/SETTERS

	get schematic() {
		return this.state.schematic || (typeof this.props.schematic === 'object' ? this.props.schematic : null);
	}
	get effectiveSmEntity() {
		const smEntity = Object.assign({},
		                               {smID: (this.schematic || {}).smID},
		                               (this.props.smEntity || {}),
		                               (this.state.smEntity || {}));

		smEntity.properties = smEntity.properties || {};
		smEntity.messages   = smEntity.messages || {};

		return smEntity;
	}
	// Function to run when we update the value of the schematic
	updatePropertyValueStatus(effectiveSchematic, value, message = true) {
		const {smID, fieldName, name} = effectiveSchematic;

		if (typeof message !== 'boolean' && typeof  message !== "object") {
			throw new Error("Expected an object or boolean for message");
		}

		const propertyChangeHandler = this.propertyChangeHandler;
		let smEntity;

		propertyChangeHandler(normalizeSmID(smID),
		                      value,
		                      effectiveSchematic);
		if (!name) return;

		smEntity = this.effectiveSmEntity;

		if (message || smEntity.messages[fieldName]) {
			smEntity.messages            = smEntity.messages || {};
			smEntity.messages[fieldName] = message;
		}

		smEntity.properties[name] = value;

		return this.setState({smEntity});
	}

	// SUBMISSION/RESPONSE MANAGEMENT

	@bind
	// handles the submission of the form
	handleSubmit(event) {
		event.preventDefault();
		const url                   = this.props.uri;
		const smEntity              = this.state.smEntity || {};
		const {canSubmit, messages} = getFormSubmissionStatus(smEntity);

		// Set the error messages on fail
		if (!canSubmit) {
			let message = Object.assign({}, this.state.message, messages, {_message: 'Could not submit form'});
			this.setState({message});
			return;
		}

		// Otherwise, go through the "loading, success/error" process below
		this.setState({status: 'loading'},
		              () => {
			              let post = Object.entries(this.state.smEntity || {})
			                               .filter(([name]) => name[0] !== '_')
			                               .map(([name, value]) => [name, value])
			                               .reduce(reduceEntriesIntoObject, {});
			              axios.post(url, post).then(({data}) => this.onSubmissionReceived(data))
		              })
	}
	// When the data has been received after submission
	onSubmissionReceived(data) {
		data                    = SmEntityModificationForm.normalizeResponse(data);
		const {status, message} = data;
		const smEntity          = this.resolveSmEntityFromData({status, message});
		this.props.onSubmissionResponseReceived && this.props.onSubmissionResponseReceived({data, smEntity});
		this.setState({status, smEntity, message});
	}
	// Get the new smEntity from the response
	resolveSmEntityFromData(data) {
		const {status, message} = data;
		let smEntity            = this.state.smEntity;
		if (typeof message === "object") {
			Object.entries(message)
			      .forEach(([propertyName, propertyMessage]) => {
				      const smEntityProperty = (smEntity.properties || {})[propertyName] || {};
				      propertyMessage.messages && Object.assign(smEntityProperty.messages || {}, propertyMessage.messages);
			      });
		}
		return {...smEntity, message};
	}

	//
	static normalizeResponse(data) {
		const status = data.success || (data.status === true) ? 'success' : 'error';
		let txt, message;
		if (status === 'error') {
			txt = {message: 'Error Processing Request', success: false};
		} else {
			txt = data && data.message && data.message._message;
		}
		if (typeof data.message === 'object') {
			message = data.message;
		} else {
			message = typeof data.message === 'string' ? {_message: data.message} : {_message: txt};
		}
		return {status, message};
	}
}

export {SmEntityModificationForm};

function mapState(state) {
	let sm = state.scenes.sm;
	return {sm: {...sm}}
}

function mapDispatch(dispatch) {
	return bindActionCreators({fetchModels,}, dispatch);
}

function getFormSubmissionStatus(smEntity) {
	let canSubmit                     = true;
	const {properties, messages = {}} = smEntity;
	const messageEntries              = Object.entries(messages || {});
	// Check the properties to make sure they are valid
	messageEntries.map(entry => {
		const [name, message] = entry;
		if (typeof message === "undefined" || (typeof message === "object" && !message)) return;
		const {status, message: text} = message;
		if (typeof status === 'undefined' || (!status && typeof status === 'object')) {
			text && (messages[name] = text);
			return;
		}
		canSubmit = canSubmit ? !!status : false;
		(messages[name] = text || (!canSubmit ? 'Invalid value' : null));
	});

	return {canSubmit, messages};
}