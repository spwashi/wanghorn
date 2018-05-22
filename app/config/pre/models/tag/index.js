import {INTEGER_, NULL_, STRING_} from "../datatypes";
import * as _ from "../_";
import {Model} from "../helpers";
import {person__identity} from "../person";

export const name          = 'tag';
export const tag__identity = Model.identify(name);
export const inherits      = _.name;
export const properties    = {
    id:  {length: 11, datatypes: [INTEGER_]},
    url: {length: 255, datatypes: [STRING_, NULL_]},
    
    text:         {length: 255, datatypes: [STRING_], unique: true},
    tag_category: {length: 255, datatypes: [STRING_], unique: true},
    
};