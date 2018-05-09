import {INTEGER_, STRING_} from "../datatypes";
import * as _ from "../_";
import {person__identity} from "../person";
import {Model} from "../helpers";

export const name           = 'user';
export const user__identity = Model.identify(name);
export const inherits       = _.name;
export const properties     = {
    username:  {
        length:    40,
        datatypes: STRING_,
        unique:    true
    },
    email:     {
        length:    255,
        datatypes: STRING_,
        unique:    true,
    },
    person_id: {
        length:    11,
        datatypes: INTEGER_,
        reference: {
            identity:        person__identity,
            hydrationMethod: {property: 'id'}
        }
    }
};