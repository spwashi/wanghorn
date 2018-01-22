const DATETIME_ = 'datetime';
const STRING_   = 'string';
const INTEGER_  = 'int';
const NULL_     = 'null';

export const models = {
    _:            {
        properties: {
            id:             {
                primary:   !0,
                datatypes: INTEGER_,
                length:    11,
            },
            creation_dt:    {
                datatypes: DATETIME_,
                _default:  'now'
            },
            delete_dt:      {
                datatypes: [DATETIME_, NULL_],
            },
            last_update_dt: {
                datatypes: [DATETIME_, NULL_]
            },
        }
    },
    universities: {
        inherits: '_',
        
        properties: {}
    },
    courses:      {
        inherits:   '_',
        properties: {
            department:    {},
            title:         {
                datatypes: STRING_,
                unique:    true,
                length:    25
            },
            course_number: {
                datatypes: [INTEGER_, NULL_],
                unique:    true,
                length:    11
            }
        }
    }
};

export default models;