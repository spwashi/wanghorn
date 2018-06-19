import {getSmEntityManagerFormats, normalizeSmID} from "./utility";

export const selectSmState = state => state.scenes.sm;

//managers
const fromSm_selectManagers                 = smState => smState.managers;
export const selectSmEntityManagers         = state => fromSm_selectManagers(selectSmState(state));
export const fromSmEntityManagersSelectType = (managers = {}, managerType) => managers[(getSmEntityManagerFormats(managerType).plural || '').toLowerCase()];

//contexts
export const fromSm_SelectContexts = smState => smState.contexts;
export const selectSmContexts      = state => {
	let smState = selectSmState(state);
	return fromSm_SelectContexts(smState);
};

//schematics
const fromSm_selectSmSchematics         = (smState, {contextName}) => {
	if (contextName) {
		let contexts = fromSm_SelectContexts(smState);
		if (!contexts[contextName]) return;
		return contexts[contextName].schematics;
	}
	return smState.schematics;
};
export const selectSmSchematics         = (state, {contextName} = {}) => {
	let smState = selectSmState(state);
	return fromSm_selectSmSchematics(smState, {contextName});
};
export const fromSmSchematicsSelectType = (managers = {}, managerType) => {
	managerType = getSmEntityManagerFormats(managerType).plural || '';
	return managers[(managerType).toLowerCase()];
};

export const selectSchematicOfSmID        = (state = {}, {smID, contextName} = {}) => {
	let schematics = selectSmSchematics(state, {contextName});
	const manager  = fromSmSchematicsSelectType(schematics, smID);
	if (!manager) return;
	return manager[smID] || manager[normalizeSmID(smID)];
};
export const fromSm_selectSchematicOfSmID = (sm = {}, {smID, contextName}) => {
	const schematics = fromSm_selectSmSchematics(sm, {contextName});
	if (schematics[smID]) {
		return schematics[smID];
	}
	const smEntitySchematics = fromSmSchematicsSelectType(schematics, smID);
	if (!smEntitySchematics) return;
	return smEntitySchematics[smID] || smEntitySchematics[normalizeSmID(smID)];
};

//smEntities
export const selectInstancesOfSmID        = (state = {}, {smID, contextName}) => {
	const managers = selectSmEntityManagers(state);
	const manager  = fromSmEntityManagersSelectType(managers, smID);
	if (!manager) return;
	return manager.instances[smID] || manager.instances[normalizeSmID(smID)];
};
export const fromSm_selectInstancesOfSmID = (state = {}, {smID, contextName}) => {
	const managers = fromSm_selectManagers(state);
	const manager  = fromSmEntityManagersSelectType(managers, smID);
	if (!manager) return;
	return manager.instances[smID] || manager.instances[normalizeSmID(smID)];
};

export const fromSm_resolveItemOfInternalID = (state = {}, {smID, _id}) => {
	const items = fromSm_selectInstancesOfSmID(state, {smID});
	return items[_id];
};