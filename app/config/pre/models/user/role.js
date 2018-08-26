import {STRING_} from "../datatypes";
import * as _ from "../_";
import {Model} from "../helpers";

export const name = 'user_role';
export const role__identity = Model.identify(name);
export const inherits = _.name;
export const properties = {
    role: {
        length: 255,
        datatypes: [STRING_],
    },
};