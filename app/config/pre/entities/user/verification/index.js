import {user_verification_hash__identity} from "../../../models/user/verification_hash";
import {Entity} from "../../helpers";
import {STRING_} from "../../../models/datatypes";

export const name = 'verification';
export const identity = Entity.identify(name);
export const persistedIdentity = user_verification_hash__identity;
export const properties = {
    hash: {
        identity: true,
        isGenerated: true,
        datatypes: STRING_,
        role: 'value'
    }
};