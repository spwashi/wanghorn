import {user__identity} from "../user";
import * as _ from "../_";
import {Model} from "../helpers";
import {INTEGER_} from "../datatypes";

export const inherits       = _.name;
export const name           = 'file';
export const file__identity = Model.identify(name);
export const properties     = {
    user_id: {
        length:    11,
        datatypes: [INTEGER_],
        reference: {
            identity:        user__identity,
            hydrationMethod: {property: 'id'}
        }
    },
};