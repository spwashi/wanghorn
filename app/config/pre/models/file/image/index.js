import {Model} from "../../helpers";
import * as _uploaded from "../../_/_uploaded";

export const name            = 'image';
export const image__identity = Model.identify(name);
export const inherits        = _uploaded.name;
export const properties      = {};