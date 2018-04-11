import * as _ from './_';
import * as user from './user';
import * as file from './file';
import * as pw from './pw';
import * as email from './email';

export const models = {
    _,
    file,
    password: pw,
    user,
    email,
};

export default models;