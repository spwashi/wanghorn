import {person__identity} from "../../models/person";
import {CONTEXT_TYPES, Entity, normalizeContexts} from "../helpers";

const getContexts              = i => {
    const self = {
        name:        'person',
        title:       'Person',
        contextType: CONTEXT_TYPES.IDENTITY
    };
    return normalizeContexts({
                                 self,
                                 login_process:  {self},
                                 signup_process: {self}
                             })
};
export const name              = 'person';
export const contexts          = getContexts();
export const identity          = Entity.identify(name);
export const persistedIdentity = person__identity;
export const properties        = {
    // user: {
    //     derivedFrom: {person_id: true},
    //     identity:    user.identity,
    // }
};
