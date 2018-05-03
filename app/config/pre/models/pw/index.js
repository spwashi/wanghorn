import {Sm} from 'spwashi-sm'
import {INTEGER_, STRING_} from "../datatypes";
import * as _ from "../_";
import {user__identity} from "../user";

const {Model, Entity} = Sm;

export const name               = 'pw';
export const password__identity = Model.identify(name);
export const inherits           = _.name;
export const properties         = {
    pw:      {
        length:    255,
        datatypes: [STRING_],
    },
    user_id: {
        length:    11,
        datatypes: [INTEGER_],
        reference: {
            identity:        user__identity,
            hydrationMethod: {
                property: 'id'
            }
        }
    }
};
export const password__entity   = {
    name:              'password',
    identity:          Entity.identify('password'),
    // How do we know that this entity is /this/ entity?
    persistedIdentity: password__identity,
    representations:   {
        inline: {
            datatypes:         STRING_,
            requireFormatting: true
        }
    }
};