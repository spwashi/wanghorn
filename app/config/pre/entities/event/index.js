import {event__identity}       from "../../models/event";
import {CONTEXT_TYPES, Entity} from "../helpers";
import {STRING_}               from "../../models/datatypes";

export const name              = 'event';
export const contexts          = {self: {name: 'event', title: 'event', contextType: CONTEXT_TYPES.IDENTITY}};
export const identity          = Entity.identify(name);
export const persistedIdentity = event__identity;
export const properties        = {
	event_name:  {
		derivedFrom: {
			identity:        event__identity,
			hydrationMethod: {
				property: 'name'
			}
		},
		datatypes:   [STRING_, 'slug']
	},
	title:       true,
	start_dt:    true,
	end_dt:      true,
	description: {
		identity: true,
		length:   2000
	},
};
