import {INTEGER_} from "../datatypes";
import * as _ from "../_";
import {Model} from "../helpers";
import {tag__identity} from "../tag";
import {project__identity} from "./index";

export const name                      = 'project_tag_map';
export const project_tag_map__identity = Model.identify(name);
export const inherits                  = _.name;
export const properties                = {
    id:         {
        length:    11,
        datatypes: [INTEGER_]
    },
    tag_id:     {
        length:    11,
        datatypes: [INTEGER_],
        reference: {
            identity:        tag__identity,
            hydrationMethod: {property: 'id'}
        }
    },
    project_id: {
        length:    11,
        datatypes: [INTEGER_],
        reference: {
            identity:        project__identity,
            hydrationMethod: {property: 'id'}
        }
    },
};

