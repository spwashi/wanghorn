import {Sm} from 'spwashi-sm'
import {user__identity} from "../user";
import * as _ from "../_";

const Model = Sm.Model;

export const inherits       = _.name;
export const name           = 'file';
export const file__identity = Model.identify(name);
export const properties     = {
    user_id: {
        reference: {
            identity:        user__identity,
            hydrationMethod: {property: 'id'}
        }
    },
};