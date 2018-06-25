import React                from "react"
import * as PropTypes       from "prop-types"
import _                    from 'lodash';
import bind                 from "bind-decorator";
import {bindActionCreators} from "redux"
import {randomString}       from "../../../../../../utility";
import {connect}            from "react-redux";
import {SmEntityFieldset}   from "./field/fieldset";
import {normalizeSmID}      from "../../../utility"
import {
	fromSm_resolveItemOfInternalID,
	fromSm_selectInstancesOfSmID,
	fromSm_selectSchematicOfSmID
}                           from "../../../selector";
import {persistSmEntity}    from "../../../actions";
import {ApiResponseMessage} from "base-components/form/response";


@connect(mapState, mapDispatch)
class SmEntityModificationForm extends React.Component {
	state            = {hasSoughtSchematic: null, schematic: null};
	static propTypes = {
		intent:                PropTypes.oneOf(["create", "edit"]).isRequired,
		contextName:           PropTypes.string,
		smEntity:              PropTypes.object,
		onPropertyValueChange: PropTypes.func,
		smID:                  PropTypes.string,
		schematic:             PropTypes.object
	};

	constructor(props) {
		super(props);
		let message                = {};
		let status                 = null;
		let schematic              = this.schematic || null;
		let smEntity               = this.props.smEntity && this.props.smEntity.smID ? this.props.smEntity : {};
		smEntity.smID              = smEntity.smID || (this.schematic && this.schematic.smID);
		this.state                 = {status, message, smEntity, schematic, _id: smEntity._id};
		this.propertyChangeHandler = this.props.onPropertyValueChange || function () {};
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
		const newState        = {hasSoughtSchematic: true, schematic};
		this.setState(newState)
	}
	get persistedInstance() {
		const props = this.props;
		return this.persistedInstanceFromProps(props);
	}
	persistedInstanceFromProps(props) {
		return fromSm_resolveItemOfInternalID(props.sm, {smID: props.smID, _id: this.internalID});
	}
	get internalID() {
		return this.effectiveSmEntity._id || this.state._id;
	}
	shouldComponentUpdate() {
		const item = this.persistedInstance || this.state.smEntity;
		if (!this.effectiveSmEntity._lastResolved) return false;
		const should = (item._lastResolved > (this.effectiveSmEntity._lastResolved || 0)) || (item || {}).properties !== (this.state.smEntity || {}).properties;
		return should;
	}
	componentWillUpdate(nextProps) {
		const item        = this.persistedInstanceFromProps(nextProps);
		const st_smEntity = this.state.smEntity;

		const hasBeenUpdated = item._lastResolved > (this.effectiveSmEntity._lastResolved || 0);

		if (!this.state._id) {
			let _id         = this.internalID || randomString();
			st_smEntity._id = _id;
			if (this.state._id !== _id) this.setState({_id});
			return;
		}
		if (!item) {
			console.log('NO PERSISTED INSTANCE');
			return;
		}

		if (hasBeenUpdated) {
			this.setState({
				              _id:      item._id || this.internalID,
				              status:   'success',
				              smEntity: item,
				              message:  item.message || this.state.message
			              });
		}
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
		return fromSm_selectInstancesOfSmID(this.props.sm, {smID});
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
		if (hasChanged) {
			this.setState(state => {
				return {...state, smEntity: _.merge(smEntity, state.smEntity)}
			});
		}
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
			smEntity.properties = {...smEntity.properties, [name]: value};
			this.setState({smEntity});
		}
	}

	// SUBMISSION/RESPONSE MANAGEMENT
	@bind
	// handles the submission of the modification
	handleSubmit(event) {
		event.preventDefault();
		const smEntity             = this.state.smEntity || {};
		const {canSubmit, message} = getFormSubmissionStatus(smEntity);

		// Set the error message on fail
		if (!canSubmit) {
			let message = Object.assign({}, this.state.message, message, {_message: 'Could not submit modification'});
			this.setState({message});
			return;
		}

		// Otherwise, go through the "loading, success/error" process below
		let _id = this.internalID;
		this.setState({status: 'loading'}, done => this.props.persist({smEntity, _id, intent: this.props.intent}))
	}

}

export {SmEntityModificationForm};

function mapState(state) {
	let sm = state.scenes.sm;
	return {sm}
}
function mapDispatch(dispatch) {
	return bindActionCreators({persist: persistSmEntity}, dispatch);
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