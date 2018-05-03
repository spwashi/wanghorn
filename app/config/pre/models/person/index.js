import {Sm} from 'spwashi-sm'
import {STRING_} from "../datatypes";
import * as _ from "../_";

const Model = Sm.Model;

export const name             = 'person';
export const person__identity = Model.identify(name);
export const inherits         = _.name;
export const properties       = {
    first_name: {datatypes: [STRING_], length: 255},
    last_name:  {datatypes: [STRING_], length: 255},
};
