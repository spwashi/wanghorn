import * as _ from "../../_/index";
import {Model} from "../../helpers";
import {INTEGER_, NULL_, STRING_} from "../../datatypes";

export const inherits                = _.name;
export const name                    = 'file_location';
export const file_location__identity = Model.identify(name);
export const properties              = {
    name:             {
        length:    50,
        datatypes: [STRING_, NULL_],
        unique:    'name'
    },
    path:             {
        length:    1000,
        datatypes: [STRING_],
        unique:    'path'
    },
};