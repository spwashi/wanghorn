import {Sm} from 'spwashi-sm'
import {INTEGER_, STRING_} from "../datatypes";
import * as _ from "../_";

const Model = Sm.Model;

export const name            = 'email';
export const email__identity = Model.identify(name);
export const inherits        = _.name;
export const properties      = {
    id:    {length: 11, datatypes: [INTEGER_]},
    email: {length: 255, datatypes: [STRING_], unique: true},
};
export const contexts        = {
    "*_email_map": {
        roleName: 'email'
    }
};