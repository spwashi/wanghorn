const PERSON = {
    user:     {
        model:   '[Model]users',
        context: null
    },
    employee: {
        model:   '[Model]employees',
        context: [
            {company: '[Model]companies'}
        ],
    }
};

export const components = {
    user:     {
        identity: PERSON.user
    },
    employee: {
        identity: PERSON.employee,
        finds:    {
            email_address: {
                container: 'email_addresses'
            }
        }
    }
};
export const properties = {
    username:        {
        index:       true,
        derivedFrom: PERSON.user,
        datatypes:   ['string'],
    },
    first_name:      {
        index:       true,
        derivedFrom: PERSON.user,
        datatypes:   ['string'],
    },
    last_name:       {
        index:       true,
        derivedFrom: PERSON.user,
        datatypes:   ['string'],
    },
    email_addresses: {
        propertyType: PERSON.user,
        derivedFrom:  [
            {source: PERSON.user, property: 'email_address'},
            {source: PERSON.employee, property: 'email_address'}
        ]
    },
};