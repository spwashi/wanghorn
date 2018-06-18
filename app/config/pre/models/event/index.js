import {DATETIME_, NULL_, STRING_} from "../datatypes";
import * as _                      from "../_";
import {Model}                     from "../helpers";

export const name            = 'event';
export const event__identity = Model.identify(name);
export const inherits        = _.name;
export const properties      = {
	title:       {
		length:    75,
		datatypes: STRING_,
		unique:    true
	},
	name:        {datatypes: [STRING_]},
	description: {length: 2500, datatypes: [STRING_, NULL_]},
	start_dt:    {datatypes: DATETIME_},
	end_dt:      {datatypes: DATETIME_}
};