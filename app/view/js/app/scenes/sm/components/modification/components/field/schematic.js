import React                             from "react"
import * as PropTypes                    from "prop-types"
import bind                              from "bind-decorator";
import {Factory}                         from "../../../../../../../modules/factory/index";
import {DefaultPropertyField}            from "./smEntity/default";
import {getTitleFromPropName, parseSmID} from "../../../../utility";
import {PropertyOwnerField}              from "./smEntity/propertyOwner";

export default class SchematicField extends React.Component {
	static propTypes = {
		name:                     PropTypes.string.isRequired,
		fieldName:                PropTypes.string.isRequired,
		schematic:                PropTypes.object.isRequired,
		value:                    PropTypes.any,
		owner:                    PropTypes.object,
		message:                  PropTypes.any,
		setDefaultValue:          PropTypes.func,
		resolveSmEntitySchematic: PropTypes.func.isRequired,
		resolveSmEntities:        PropTypes.func.isRequired,
		updateValueStatus:        PropTypes.func.isRequired
	};
	       state     = {};

	render() {
		const componentProps = {
			schematic:                this.props.schematic,
			name:                     this.props.name,
			fieldName:                this.props.fieldName,
			value:                    this.props.value,
			owner:                    this.props.owner,
			title:                    getTitleFromPropName(this.props.name),
			message:                  this.props.message,
			setDefaultValue:          this.setDefaultValue,
			onValueChange:            this.onValueChange,
			primaryDatatype:          this.props.schematic.datatypes && this.props.schematic.datatypes[0],
			resolveSmEntities:        this.props.resolveSmEntities,
			resolveSmEntitySchematic: this.props.resolveSmEntitySchematic
		};
		const Component      = SchematicField.fieldFactory.Component;
		return <Component {...this.props} {...componentProps} />
	}
	@bind
	setDefaultValue(value, message) {
		if (!this.props.value) {
			this.props.setDefaultValue && this.props.setDefaultValue(this.effectiveSchematic,
			                                                         value,
			                                                         message)
		}
	}
	@bind
	onValueChange(value, checkPropertyValidity = (schematic, value) => true) {
		const effectiveSchematic = this.effectiveSchematic;
		const validityStatus     = checkPropertyValidity(effectiveSchematic, value);
		const updateValueStatus  = this.props.updateValueStatus;
		return updateValueStatus(effectiveSchematic, value, validityStatus) || true;
	}
	get effectiveSchematic() {
		const schematic = this.props.schematic;
		const fieldName = this.props.fieldName;
		const smID      = schematic.smID;
		return {smID, fieldName, ...schematic};
	}
};
SchematicField.fieldFactory = new Factory([
	                                          props => DefaultPropertyField,
	                                          props => {
		                                          const {smID}    = props.schematic;
		                                          const {manager} = parseSmID(smID);
		                                          if (manager === 'Model' || manager === 'Entity') {
			                                          return PropertyOwnerField;
		                                          } else {
			                                          return null;
		                                          }
	                                          }
                                          ]);