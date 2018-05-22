import * as _ from './_';
import * as user from './user';
import * as file from './file';
import * as tag from './tag';
import * as email from './email';
import * as event from './event';
import * as person from './person';

import * as project from './project';
import * as project_tag_map from './project/project_tag_map';

import * as password from './password';

export const models = {
    _,
    
    tag,
    file,
    user,
    event,
    email,
    person,
    
    // Project tables
    project,
    project_tag_map,
    
    password,
};

export default models;