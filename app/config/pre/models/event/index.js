import {DATETIME_, STRING_} from "../datatypes";
import * as _ from "../_";
import {Model} from "../helpers";

export const name            = 'event';
export const event__identity = Model.identify(name);
export const inherits        = _.name;
export const properties      = {
    title:       {
        length:    75,
        datatypes: STRING_,
        unique:    true
    },
    start_dt:    {datatypes: DATETIME_},
    end_dt:      {datatypes: DATETIME_},
    hr_duration: {datatypes: STRING_},
};