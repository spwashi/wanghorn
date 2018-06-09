import {password__identity} from "../../../models/password/index";
import {Entity} from "../../helpers";

export const name              = 'password';
export const identity          = Entity.identify(name);
// How do we know that this entity is /this/ entity?
export const persistedIdentity = password__identity;
export const properties        = {
    password: {
        identity:  true, // We inherit this property from the model
        minLength: 8,
        datatypes: 'password',
        role:      'value'
    }
};