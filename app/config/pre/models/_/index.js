import {Sm} from 'spwashi-sm'
import {DATETIME_, INTEGER_, NULL_} from "../datatypes";

const Model = Sm.Model;

export const name        = '_';
export const ___identity = Model.identify(name);
export const properties  = {
    id:             {
        primary:     !0,
        datatypes:   INTEGER_,
        length:      11,
        isGenerated: true
    },
    delete_dt:      {
        datatypes: [DATETIME_, NULL_],
    },
    creation_dt:    {
        datatypes:    DATETIME_,
        defaultValue: 'now'
    },
    last_update_dt: {
        datatypes:    DATETIME_,
        updateValue:  'now',
        defaultValue: 'now'
        
    },
};
