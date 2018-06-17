import React                           from "react"
import * as PropTypes                  from "prop-types"
import {normalizeSchematic, parseSmID} from "../../../../../utility";
import SchematicField                  from "../schematic";

export class SmEntityField extends React.Component {
	static propTypes            = {
		fieldName:       PropTypes.string.isRequired,
		setDefaultValue: PropTypes.func,

		value:   PropTypes.any,
		owner:   PropTypes.object,
		message: PropTypes.any,

		resolveSmEntitySchematic: PropTypes.func.isRequired,
		resolveSmEntities:        PropTypes.func.isRequired,
		updateValueStatus:        PropTypes.func.isRequired,
	};
	       _normalizedSchematic = null;

	render() {
		const schematic    = this.getNormalizedSchematic();
		const {name, smID} = schematic;
		return <SchematicField name={name}
		                       fieldName={this.props.fieldName || name}
		                       schematic={this.getNormalizedSchematic()}
		                       value={this.props.value}
		                       owner={this.props.owner}
		                       message={this.props.message}
		                       setDefaultValue={this.props.setDefaultValue}
		                       resolveSmEntitySchematic={this.props.resolveSmEntitySchematic}
		                       resolveSmEntities={this.props.resolveSmEntities}
		                       updateValueStatus={this.props.updateValueStatus}/>;
	}

	getNormalizedSchematic() {
		if (this._normalizedSchematic) return this._normalizedSchematic;
		const schematic     = normalizeSchematic({...(this.props.schematic || {})});
		schematic.fieldName = schematic.fieldName || this.props.fieldName;
		return this._normalizedSchematic = schematic;
	}
}