import {user__identity} from "../user";
import * as _ from "../_";
import {Model} from "../helpers";
import {INTEGER_, NULL_, STRING_} from "../datatypes";
import {file_location__identity} from "./file_location";

export const inherits       = _.name;
export const name           = 'file';
export const file__identity = Model.identify(name);
export const properties     = {
    name:             {
        length:    50,
        datatypes: [STRING_, NULL_],
        unique:    'name'
    },
    user_id:          {
        length:    11,
        datatypes: [INTEGER_],
        reference: {
            identity:        user__identity,
            hydrationMethod: {property: 'id'}
        }
    },
    file_location_id: {
        length:    11,
        datatypes: [INTEGER_],
        reference: {
            identity:        file_location__identity,
            hydrationMethod: {property: 'id'}
        }
    },
};