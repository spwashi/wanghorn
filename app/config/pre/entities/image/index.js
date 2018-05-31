import {image__identity} from "../../models/file/image";
import {CONTEXT_TYPES, Entity} from "../helpers";
import {NULL_, STRING_} from "../../models/datatypes";

const getContexts              = () => {
    const self = {
        name:        'image',
        title:       'image',
        contextType: CONTEXT_TYPES.IDENTITY
    };
    return {
        self,
        login_process:  {self},
        signup_process: {self}
    }
};
export const name              = 'image';
export const contexts          = getContexts();
export const identity          = Entity.identify(name);
export const persistedIdentity = image__identity;
export const properties        = {
    name: true,
    url:  {datatypes: ['url', STRING_, NULL_]},
    file: {datatypes: ['file']}
};
