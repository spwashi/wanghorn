import {Sm} from 'spwashi-sm'

const Model = Sm.Model;

const STRING_  = 'string';
const INTEGER_ = 'int';
const NULL_    = 'null';

export const inherits   = '_';
export const properties = {
    email:      {length: 255, datatypes: [STRING_], unique: true},
    first_name: {length: 50, datatypes: [STRING_, NULL_]},
    last_name:  {length: 50, datatypes: [STRING_, NULL_]}
};