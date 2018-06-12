import {event__identity}       from "../../models/event";
import {CONTEXT_TYPES, Entity} from "../helpers";

export const name              = 'event';
export const contexts          = {self: {name: 'event', title: 'event', contextType: CONTEXT_TYPES.IDENTITY}};
export const identity          = Entity.identify(name);
export const persistedIdentity = event__identity;
export const properties        = {
	name:        true,
	title:       true,
	start_dt:    true,
	end_dt:      true,
	description: {
		identity:  true,
		minLength: 2000
	},
};
