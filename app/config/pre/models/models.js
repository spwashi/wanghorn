import * as _ from './_';
import * as _uploaded from './_/_uploaded';
import * as user from './user';
import * as user_verification_hash from './user/verification_hash';
import * as file from './file';
import * as tag from './tag';
import * as email from './email';
import * as event from './event';
import * as person from './person';
import * as image from './file/image/index.js';
import * as file_location from './file/file_location/index.js';
import * as project from './project';
import * as project_tag_map from './project/project_tag_map';
import * as password from './password';

export const models = {
    _,
    _uploaded,
    
    tag,
    file,
    file_location,
    image,
    
    user,
    user_verification_hash,
    event,
    email,
    person,
    
    project,
    project_tag_map,
    
    password,
};

export default models;