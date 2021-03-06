import {user__identity} from "../../models/user";
import {CONTEXT_TYPES, normalizeContexts} from "../helpers";
import * as password from './password'
import {Entity} from "../helpers";
import * as verification from "./verification";
import * as role from "./role";
import {role__identity} from "../../models/user/role";

const getContexts = () => {
    const self = {
        name: 'user',
        title: 'User',
        contextType: CONTEXT_TYPES.IDENTITY
    };
    return {
        self,
        login_process: {self},
        '::authorization': {self},
        '::verification': {self},
        signup_process: {self}
    }
};
export const name = 'user';
export const contexts = getContexts();
export const identity = Entity.identify(name);
export const persistedIdentity = user__identity;
export const properties = {
    username: true,
    email: {identity: true},
    role: {
        derivedFrom: {role_id: 'id'},
        identity: role.identity,
        contexts: ['::authorization']
    },
    password: {
        // This property is derived by joining on the password entity's persisted identity injecting this as the user_id
        derivedFrom: {user_id: true},
        identity: password.identity,
        contexts: ['login_process', 'signup_process']
    },
    verification: {
        derivedFrom: {user_id: true},
        isGenerated: true,
        identity: verification.identity,
        contexts: ['::verification'] // todo come up with better notation for internal contexts app
    }
};
