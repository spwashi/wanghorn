import {Sm} from 'spwashi-sm'
import {INTEGER_} from "../datatypes";

const Model = Sm.Model;

export const name        = '_';
export const ___identity = Model.identify(name);
export const properties  = {
    id: {
        length:    11,
        datatypes: [INTEGER_],
        primary:   true,
    }
};
