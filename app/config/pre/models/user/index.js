import {Sm} from 'spwashi-sm'
import {NULL_, STRING_} from "../datatypes";
import * as _ from "../_/index";

const Model = Sm.Model;

export const name           = 'user';
export const user__identity = Model.identify(name);
export const inherits       = _.name;
export const properties     = {
    email:      {
        length:    255,
        datatypes: [STRING_],
        unique:    true,
    },
    first_name: {
        length:    50,
        datatypes: [STRING_, NULL_]
    },
    last_name:  {
        length:    50,
        datatypes: [STRING_, NULL_]
    }
};