import {Sm} from 'spwashi-sm'
import {STRING_} from "../datatypes";
import * as _ from "../_";

const Model = Sm.Model;

export const name              = 'project';
export const project__identity = Model.identify(name);
export const inherits          = _.name;
export const properties        = {
    name: {length: 255, datatypes: [STRING_],},
    url:  {length: 255, datatypes: [STRING_],},
};