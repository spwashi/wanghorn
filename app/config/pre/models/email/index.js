import {INTEGER_, STRING_} from "../datatypes";
import * as _ from "../_";
import {Model} from "../helpers";
import {user__identity} from "../user";

export const name            = 'email';
export const email__identity = Model.identify(name);
export const inherits        = _.name;
export const properties      = {
    id:      {length: 11, datatypes: [INTEGER_]},
    email:   {length: 255, datatypes: [STRING_], unique: true},
    user_id: {
        length:    11,
        datatypes: [INTEGER_],
        reference: {
            identity:        user__identity,
            hydrationMethod: {property: 'id'}
        }
    },
};