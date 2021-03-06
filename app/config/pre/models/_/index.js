import {DATETIME_, INTEGER_, NULL_} from "../datatypes";
import {Model}                      from "../helpers";

export const name        = '_';
export const ___identity = Model.identify(name);
export const properties  = {
	id:             {
		datatypes:   INTEGER_,
		length:      11,
		primary:     true,
		isGenerated: true
	},
	delete_dt:      {
		datatypes:   [DATETIME_, NULL_],
		isGenerated: true
	},
	creation_dt:    {
		datatypes:    DATETIME_,
		defaultValue: 'now',
		isGenerated:  true
	},
	last_update_dt: {
		datatypes:    DATETIME_,
		updateValue:  'now',
		defaultValue: 'now',
		isGenerated:  true
	}
};
