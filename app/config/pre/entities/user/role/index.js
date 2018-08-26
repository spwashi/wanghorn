import {role__identity} from "../../../models/user/role";
import {Entity} from "../../helpers";
import {STRING_} from "../../../models/datatypes";

export const name = 'user_role';
export const identity = Entity.identify(name);
// How do we know that this entity is /this/ entity?
export const persistedIdentity = role__identity;
export const properties = {
    role: {
        identity: true, // We inherit this property from the model
        datatypes: STRING_,
    },
    id: {
        role: 'value'
    }
};