import * as _ from "../_";
import {Model} from "../helpers";
import * as _uploaded from "../_/_uploaded";

export const name           = 'file';
export const file__identity = Model.identify(name);
export const inherits       = [_.name, _uploaded.name];
export const properties     = {};