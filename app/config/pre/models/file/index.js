import {Sm} from 'spwashi-sm'
import {user__identity} from "../user/index";
import {INTEGER_} from "../datatypes";
import * as _ from "../_/index";

const Model = Sm.Model;

export const inherits       = _.name;
export const name           = 'file';
export const file__identity = Model.identify(name);
export const properties     = {
    user_id: {
        length:    11,
        datatypes: [INTEGER_],
        reference: {
            identity:        user__identity,
            hydrationMethod: {
                property: 'id'
            }
        }
    },
};