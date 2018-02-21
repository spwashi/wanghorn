import * as user from './user';

const DATETIME_ = 'datetime';
const STRING_   = 'string';
const INTEGER_  = 'int';
const NULL_     = 'null';

export const models = {
    _: {
        properties: {
            id:             {
                primary:     !0,
                isGenerated: true,
                datatypes:   INTEGER_,
                length:      11,
            },
            delete_dt:      {
                datatypes: [DATETIME_, NULL_],
            },
            creation_dt:    {
                datatypes:    [DATETIME_],
                defaultValue: 'now'
            },
            last_update_dt: {
                datatypes:   [DATETIME_, NULL_],
                updateValue: 'now'
            },
        }
    },
    
    emails: {
        inherits:   '_',
        properties: {
            email_address: {length: 255, datatypes: [STRING_]},
        },
        cast:       [
            {
                given:       ['{[Model]users}email'],
                isRedundant: false,
                produce:     {
                    email_address: '{[Model]users}email'
                }
            }
        ]
        
    },
    
    users:   user,
    clients: {
        inherits:   '_',
        properties: {
            note:       {datatypes: [STRING_, NULL_], length: 3000,},
            user_id:    {datatypes: INTEGER_, length: 11,},
            clients_id: {datatypes: INTEGER_, length: 11,},
        }
    }
};

export default models;