import React                                                    from "react"
import * as PropTypes                                           from "prop-types"
import _                                                        from 'lodash';
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
import ValueRepresentation                                      from "./field/internal/valueRepresentationProxy";


@connect(mapState, mapDispatch)
class SmEntityModificationForm extends React.Component {
	state            = {hasSoughtSchematic: null, schematic: null};
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
		let schematic              = this.schematic || null;
		let smEntity               = this.props.smEntity && this.props.smEntity.smID ? this.props.smEntity : {};
		smEntity.smID              = smEntity.smID || (this.schematic && this.schematic.smID);
		let message                = {};
		let status                 = null;
		this.state                 = {status, message, smEntity, schematic};
		this.propertyChangeHandler = this.props.onPropertyValueChange || function () {
		};
	}

	// LIFECYCLE
	componentDidMount() {
		if (this.state.schematic || this.state.hasSoughtSchematic) return;

		let smEntity          = this.state.smEntity;
		let schematic         = this.props.schematic || {};
		let smID              = (schematic && schematic.smID) || (smEntity && smEntity.smID) || this.props.smID;
		let contextName       = this.props.contextName;
		let schematicResolved = fromSm_selectSchematicOfSmID(this.props.sm, {smID, contextName});
		schematic             = (schematicResolved && schematicResolved.smID ? schematicResolved : this.state.schematic);
		this.setState({hasSoughtSchematic: true, schematic})
	}
	shouldComponentUpdate(props, state, context) {
		return true;
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
				                  message={this.state.message}
				                  smEntity={this.effectiveSmEntity}
				                  setDefaultValue={this.setFieldDefaultValue.bind(this)}
				                  resolveSmEntities={resolveSmEntities}
				                  updatePropertyValueStatus={this.updatePropertyValueStatus.bind(this)}
				                  resolveSmEntitySchematic={resolveSmEntitySchematic}/>
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
		let smID       = (this.schematic || {}).smID;
		const smEntity = _.merge({smID},
		                         (this.props.smEntity || {}),
		                         (this.state.smEntity || {}));

		smEntity.properties = smEntity.properties || {};
		smEntity.message    = smEntity.message || {};

		return smEntity;
	}
	setFieldDefaultValue(effectiveSchematic, value, message = true) {
		const {smID, fieldName, name} = effectiveSchematic;
		let smEntity                  = this.effectiveSmEntity;
		if (!name) return;
		let hasChanged = false;


		if ((value != smEntity.properties[name]) && !smEntity.properties[name]) {
			smEntity.properties[name] = value;
			hasChanged                = true;
		}

		if ((message !== smEntity.message[name]) && !smEntity.message[name]) {
			smEntity.message[name] = message;
			hasChanged             = true;
		}
		hasChanged && this.setState(
			state => {
				return {
					...state,
					smEntity: _.merge({}, smEntity, state.smEntity)
				}
			});
	}
	// Function to run when we update the value of the schematic
	updatePropertyValueStatus(effectiveSchematic, value, message = true) {
		const {smID, fieldName, name} = effectiveSchematic;
		if (typeof message !== 'boolean' && typeof  message !== "object") throw new Error("Expected an object or boolean for message");
		this.propertyChangeHandler(normalizeSmID(smID), value, effectiveSchematic);
		if (!name) return;
		let smEntity = this.effectiveSmEntity;
		if (message || smEntity.message[fieldName]) {
			smEntity.message            = smEntity.message || {};
			smEntity.message[fieldName] = message;
		}
		if (value !== smEntity.properties[name]) {
			smEntity.properties[name] = value;
			this.setState({smEntity});
		}
	}

	// SUBMISSION/RESPONSE MANAGEMENT

	@bind
	// handles the submission of the modification
	handleSubmit(event) {
		event.preventDefault();
		const url                  = this.props.uri;
		const smEntity             = this.state.smEntity || {};
		const {canSubmit, message} = getFormSubmissionStatus(smEntity);

		// Set the error message on fail
		if (!canSubmit) {
			let message = Object.assign({}, this.state.message, message, {_message: 'Could not submit modification'});
			this.setState({message});
			return;
		}

		// Otherwise, go through the "loading, success/error" process below
		this.setState({status: 'loading'},
		              () => {
			              const post = Object.entries(this.state.smEntity || {})
			                                 .filter(([name]) => name[0] !== '_')
			                                 .map(([name, value]) => [name, value])
			                                 .reduce(reduceEntriesIntoObject, {});

			              post.properties && Object.entries(post.properties || {})
			                                       .forEach(entry => {
				                                       const [name, property] = entry;
				                                       post.properties[name]  = property instanceof ValueRepresentation ? property.value : property;
			                                       });

			              axios.post(url + '?d_lm=q', post)
			                   .then(({data}) => this.onSubmissionReceived(data))
		              })
	}
	// When the data has been received after submission
	onSubmissionReceived(data) {
		data                    = SmEntityModificationForm.normalizeResponse(data);
		const {status, message} = data;
		const smEntity          = this.resolveSmEntityFromData({status, message});
		console.log(status);
		let responseReceived = this.props.onSubmissionResponseReceived;
		if (responseReceived) {
			responseReceived({data, smEntity: status !== 'error' ? smEntity : null});
		}
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
				      propertyMessage.message && Object.assign(smEntityProperty.message || {}, propertyMessage.message);
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
	return {sm}
}

function mapDispatch(dispatch) {
	return bindActionCreators({fetchModels,}, dispatch);
}

function getFormSubmissionStatus(smEntity) {
	let canSubmit                    = true;
	const {properties, message = {}} = smEntity;
	const messageEntries             = Object.entries(message || {});
	// Check the properties to make sure they are valid
	messageEntries.map(entry => {
		const [name, message] = entry;
		if (typeof message === "undefined" || (typeof message === "object" && !message)) return;
		const {status, message: text} = message;
		if (typeof status === 'undefined' || (!status && typeof status === 'object')) {
			text && (message[name] = text);
			return;
		}
		canSubmit = canSubmit ? !!status : false;
		(message[name] = text || (!canSubmit ? 'Invalid value' : null));
	});

	return {canSubmit, message};
}