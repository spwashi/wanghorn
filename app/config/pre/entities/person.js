import {user__identity} from "../models/user";
import {password__entity} from "../models/pw";

const CONTEXT_TYPES = {TYPE: 'type', IDENTITY: 'identity'};

let getStandardUserContext = () => ({
    self:   {
        name:        'user',
        contextType: CONTEXT_TYPES.IDENTITY,
        title:       'User'
    },
    others: null
});
export const contexts      = {
    logging_in: {name: 'logging_in', ...getStandardUserContext()},
    signing_up: {name: 'signing_up', ...getStandardUserContext()}
};
export const components    = {
    user: {
        identity:   user__identity,
        properties: {
            password: {
                identity: password__entity.identity,
                contexts: [contexts.logging_in, contexts.signing_up]
            }
        }
    },
};