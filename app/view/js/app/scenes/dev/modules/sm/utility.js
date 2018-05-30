import {parseSmID} from "spwashi-sm/src/components/sm/utility"
export const normalizeSmID        = smID => (smID || '').replace(' ', '');
export const getNameFromSmID      = smID => /\[[a-zA-Z_]+]}?\s?([a-zA-Z_]+)/.exec(normalizeSmID(smID) || [])[1] || false;
export {parseSmID};
export const getTitleFromPropName = name => {
    name = name.replace(/_([a-z])/g, ([str, match]) => ` ${match}`.toUpperCase())
               .replace('Dt', 'Date')
               .replace('id', 'ID');
    return name.length && (name[0].toUpperCase() + name.substr(1)) || '';
};