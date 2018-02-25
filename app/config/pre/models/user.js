import {Sm} from 'spwashi-sm'

const Model    = Sm.Model;
const STRING_  = 'string';
const INTEGER_ = 'int';
const NULL_    = 'null';

export const inherits                 = '_';
export const properties               = {
    email:      {length: 255, datatypes: [STRING_], unique: true},
    first_name: {length: 50, datatypes: [STRING_, NULL_]},
    last_name:  {length: 50, datatypes: [STRING_, NULL_]}
};
export const relatedTo                = {};
relatedTo[Model.identify('emails')]   =
    [
        {
            from: {
                user: Model.identify('users')
            },
            
            actingAs:   'user',
            accessedAs: 'primary_email',
            indexedBy:  Model.identify('emails'),
            
            fetchMethod: 'cast',
            
            relationship: {
                amount: 1
            }
        },
        {
            from: {
                user:  Model.identify('users'),
                email: Model.identify('emails')
            },
            
            actingAs:   'user',
            indexedBy:  Model.identify('emails'),
            accessedAs: 'emails',
            
            fetchMethod: 'query',
            
            relationship: {
                amount: 'many',
                model:  {
                    inherits: '_',
                    name:     '[Model]person_email_map',
                    
                    map: {
                        person_id: '{user}person_id',
                        email_id:  '{email}id'
                    },
                    
                    properties: {}
                }
            }
        }
    ];
relatedTo[Model.identify('accounts')] = {
    from:         {
        owner:   Model.identify('users'),
        account: Model.identify('accounts')
    },
    indexedBy:    Model.identify('accounts'),
    relationship: {
        amount: 'many',
        model:  {
            inherits: '_',
            name:     '[Model]user_account_map',
            
            map: {
                account_id: '{account}id',
                owner_id:   '{owner}id'
            },
            
            properties: {
                user_role: {length: 11, datatypes: [INTEGER_]},
            }
        }
    }
};