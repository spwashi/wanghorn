import {DATETIME_, NULL_, STRING_} from "../datatypes";
import * as _ from "../_";
import {Model} from "../helpers";

export const name           = 'user';
export const user__identity = Model.identify(name);
export const inherits       = _.name;
export const properties     = {
    username:        {
        length:    40,
        datatypes: STRING_,
        unique:    true
    },
    email:           {
        length:    255,
        datatypes: STRING_,
        unique:    true,
    },
    verification_dt: {
        datatypes:   [DATETIME_, NULL_],
        isGenerated: true
    }
};