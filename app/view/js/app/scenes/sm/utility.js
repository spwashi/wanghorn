import {parseSmID as parse_sm_id} from "spwashi-sm/src/components/sm/utility"

const parseSmID: (() => ({ manager: string, owner: string, name: string })) = parse_sm_id;
const isSmID                                                                = item => {
	const {manager, owner, name} = parse_sm_id(item);
	return !!(manager && name);
};
export {parseSmID, isSmID};

export const normalizeSchematic        = function (schematic) {
	const parsed   = parseSmID(schematic) || {};
	const name     = schematic.name ? schematic.name : parsed.name;
	schematic.name = schematic.name || name;
	return schematic;
};
export const getSmEntityManagerFormats = manager => {
	let ownerType_plural;
	manager = parseSmID(manager).manager || manager;
	if (/model/i.test(manager)) {
		ownerType_plural = manager + 's';
	} else if (/entity|property/i.test(manager)) {
		ownerType_plural = manager.substr(0, manager.length - 1) + 'ies';
	} else {
		ownerType_plural = false;
	}
	return {
		lowercase:   (manager || '').toLowerCase(),
		plural:      ownerType_plural,
		managerName: `[${manager.length && (manager[0].toUpperCase() + manager.substr(1)) || ''}]`
	};
};
export const normalizeSmID             = smID => (smID || '').replace(' ', '');
export const getNameFromSmID           = smID => /\[[a-zA-Z_]+]}?\s?([a-zA-Z_]+)/.exec(normalizeSmID(smID) || [])[1] || false;
export const getTitleFromPropName      = name => {
	name = name.replace(/_([a-z])/g, ([str, match]) => ` ${match}`.toUpperCase())
	           .replace('Dt', 'Date')
	           .replace('id', 'ID');
	return name.length && (name[0].toUpperCase() + name.substr(1)) || '';
};