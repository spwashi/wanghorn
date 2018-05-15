export const normalizeSmID        = smID => (smID || '').replace(' ', '');
export const getTitleFromPropName = name => {
    name = name.replace(/_([a-z])/g, ([str, match]) => ` ${match}`.toUpperCase())
               .replace('Dt', 'Date')
               .replace('id', 'ID');
    return name.length && (name[0].toUpperCase() + name.substr(1)) || '';
};