import {DATETIME_, INTEGER_, NULL_, STRING_} from "../datatypes";
import * as _ from "../_";
import {Model} from "../helpers";
import {role__identity} from "./role";

export const name = 'user';
export const user__identity = Model.identify(name);
export const inherits = _.name;
export const properties = {
    username: {
        length: 40,
        datatypes: STRING_,
        unique: true
    },
    role_id: {
        length: 11,
        datatypes: [INTEGER_, NULL_],
        defaultValue: 1,
        reference: {
            identity: role__identity,
            hydrationMethod: {
                property: 'id'
            }
        }
    },
    email: {
        length: 255,
        datatypes: STRING_,
        unique: true,
    },
    verification_dt: {
        datatypes: [DATETIME_, NULL_],
        isGenerated: true
    }
};