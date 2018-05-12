export const getSettablePropertiesFromSmEntity = ({properties = {}}) => {
    return Object.entries(properties)
                 .filter(([name, prop]) => !prop.isGenerated)
                 .reduce((all, entry) => {
                     const [k, v] = entry;
                     all[k]       = v;
                     return all;
                 }, {});
};