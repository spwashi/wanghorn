import {
	FETCH_SM_ENTITIES,
	FETCH_SM_ENTITIES_RECEIVED,
	FETCH_SM_ENTITY_SCHEMATIC,
	FETCH_SM_ENTITY_SCHEMATIC_RECEIVED,
	PERSIST_SM_ENTITY,
	PERSIST_SM_ENTITY_COMPLETED,
	PERSIST_SM_ENTITY_FAILED
} from "./types";

export const CONTEXT_RESOLVED = 'CONTEXT_RESOLVED';

export const markContextResolved = ({context}) => ({
	type: CONTEXT_RESOLVED,
	context
});

export const fetchSmEntitySchematic           = ({smID} = {}) => ({type: FETCH_SM_ENTITY_SCHEMATIC, smID});
export const fetchSmEntitySchematic__received = ({smID} = {}) => ({type: FETCH_SM_ENTITY_SCHEMATIC_RECEIVED, smID});
export const fetchSmEntities                  = ({smID} = {}) => ({type: FETCH_SM_ENTITIES, smID});
export const fetchSmEntities__received        = ({smID} = {}) => ({type: FETCH_SM_ENTITIES_RECEIVED, smID});


export const persistSmEntity            = ({_id, smEntity}) => ({type: PERSIST_SM_ENTITY, smEntity, _id});
export const persistSmEntity__completed = ({_id, smEntity}) => ({type: PERSIST_SM_ENTITY_COMPLETED, smEntity, _id});
export const persistSmEntity__failed    = ({_id, smEntity}) => ({type: PERSIST_SM_ENTITY_FAILED, smEntity, _id});