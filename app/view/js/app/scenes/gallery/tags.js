const TAG_TYPE__PROGRAMMING_LANGUAGE = 'programming_language';

function tagAsType(type, all) {
    Object.entries(all)
          .forEach(([index, config]) => {
              config.name = (config.name || (config.text || '').replace(/[\s]/g, ' ')).toLowerCase();
              config.type = type;
          });
    return {...all}
}

export const programmingLanguages = tagAsType(TAG_TYPE__PROGRAMMING_LANGUAGE,
                                              {
                                                  PHP:        {text: 'PHP',},
                                                  ECMAScript: {text: 'ECMAScript',}
                                              });