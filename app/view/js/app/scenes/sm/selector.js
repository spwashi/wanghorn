import {getSmEntityManagerFormats, normalizeSmID} from "./utility";

export const selectSmState = state => state.scenes.sm;

//managers
const fromSm_selectManagers                 = smState => smState.managers;
export const selectSmEntityManagers         = state => fromSm_selectManagers(selectSmState(state));
export const fromSmEntityManagersSelectType = (managers = {}, managerType) => managers[(getSmEntityManagerFormats(managerType).plural || '').toLowerCase()];

//schematics
const fromSm_selectSmSchematics         = smState => smState.schematics;
export const selectSmSchematics         = state => fromSm_selectSmSchematics(selectSmState(state));
export const fromSmSchematicsSelectType = (managers = {}, managerType) => managers[(getSmEntityManagerFormats(managerType).plural || '').toLowerCase()];

//contexts
export const selectSmContexts = state => selectSmState(state).contexts;

export const selectSchematicOfSmID        = (state = {}, {smID, contextName}) => {
    const manager = fromSmSchematicsSelectType(selectSmSchematics(state), smID);
    if (!manager) return;
    return manager[smID] || manager[normalizeSmID(smID)];
};
export const fromSm_selectSchematicOfSmID = (state = {}, {smID, contextName}) => {
    const schematics         = fromSm_selectSmSchematics(state);
    const smEntitySchematics = fromSmSchematicsSelectType(schematics, smID);
    if (!smEntitySchematics) return;
    return smEntitySchematics[smID] || smEntitySchematics[normalizeSmID(smID)];
};
export const selectItemsOfSmID            = (state = {}, {smID, contextName}) => {
    const managers = selectSmEntityManagers(state);
    const manager  = fromSmEntityManagersSelectType(managers, smID);
    if (!manager) return;
    return manager.items[smID] || manager.items[normalizeSmID(smID)];
};
export const fromSm_selectItemsOfSmID     = (state = {}, {smID, contextName}) => {
    const managers = fromSm_selectManagers(state);
    const manager  = fromSmEntityManagersSelectType(managers, smID);
    if (!manager) return;
    return manager.items[smID] || manager.items[normalizeSmID(smID)];
};