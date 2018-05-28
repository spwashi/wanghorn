import * as _ from "../../_/index";
import {Model} from "../../helpers";
import {INTEGER_, STRING_} from "../../datatypes";
import {file_location__identity} from "../file_location/index";

export const inherits        = _.name;
export const name            = 'image';
export const image__identity = Model.identify(name);
export const properties      = {
    name:             {
        length:    50,
        datatypes: [STRING_],
        unique:    true,
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