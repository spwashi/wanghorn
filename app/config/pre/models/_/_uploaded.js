import {INTEGER_, STRING_} from "../datatypes";
import * as _ from "../_";
import {Model} from "../helpers";
import {user__identity} from "../user";
import {file_location__identity} from "../file/file_location";

export const name                = '_uploaded';
export const _uploaded__identity = Model.identify(name);
export const inherits            = _.name;
export const properties          = {
    name:             {
        length:    50,
        datatypes: [STRING_],
        unique:    true,
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
        },
        unique:    true
    },
};