import {FETCH_SM_ENTITIES, FETCH_SM_ENTITIES_RECEIVED, FETCH_SM_ENTITY_SCHEMATIC, FETCH_SM_ENTITY_SCHEMATIC_RECEIVED} from "./types";

export const CONTEXT_RESOLVED = 'CONTEXT_RESOLVED';

export const markContextResolved = context => ({
    type: CONTEXT_RESOLVED,
    context
});

export const fetchSmEntitySchematic           = ({smID} = {}) => ({type: FETCH_SM_ENTITY_SCHEMATIC, smID});
export const fetchSmEntitySchematic__received = ({smID} = {}) => ({type: FETCH_SM_ENTITY_SCHEMATIC_RECEIVED, smID});
export const fetchSmEntities                  = ({smID} = {}) => ({type: FETCH_SM_ENTITIES, smID});
export const fetchSmEntities__received        = ({smID} = {}) => ({type: FETCH_SM_ENTITIES_RECEIVED, smID});