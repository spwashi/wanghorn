import {INTEGER_, NULL_, STRING_} from "../datatypes";
import * as _ from "../_";
import {Model} from "../helpers";
import {user__identity} from "../user";
import {file_location__identity} from "../file/file_location";

export const name                = '_uploaded';
export const _uploaded__identity = Model.identify(name);
export const inherits            = _.name;
export const properties          = {
    readable_name:    {length: 50, datatypes: STRING_},
    name:             {length: 50, datatypes: [STRING_], unique: true, isGenerated: true},
    mime:             {length: 50, datatypes: STRING_, isGenerated: true},
    size:             {length: 11, datatypes: INTEGER_, isGenerated: false},
    hash:             {length: 50, datatypes: STRING_, isGenerated: true},
    file_location_id: {
        length:    11, datatypes: [INTEGER_],
        reference: {identity: file_location__identity, hydrationMethod: {property: 'id'}},
        unique:    true
    },
    user_id:          {
        length:    11, datatypes: [INTEGER_, NULL_],
        reference: {identity: user__identity, hydrationMethod: {property: 'id'}}
    },
};