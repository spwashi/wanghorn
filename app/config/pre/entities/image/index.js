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
    name:     true,
    filename: {
        datatypes:   [STRING_],
        length:      50,
        derivedFrom: {
            identity:        image__identity,
            hydrationMethod: {
                property: 'readable_name'
            }
        },
    },
    
    url:              {length: 300, datatypes: ['url', STRING_, NULL_]},
    file_location_id: true,
    file:             {datatypes: ['file']}
};
