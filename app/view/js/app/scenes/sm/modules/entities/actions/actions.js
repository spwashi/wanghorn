import {ENTITY_INSTANCE_RESOLVED, FETCH_ENTITY_INSTANCES, FETCH_ENTITY_INSTANCES_RECEIVED, FETCH_ENTITY_METAS, FETCH_ENTITY_METAS_RECEIVED} from "./types";

export const fetchEntityMetasBegin     = () => ({type: FETCH_ENTITY_METAS,});
export const fetchEntityMetasCompleted = entities => ({type: FETCH_ENTITY_METAS_RECEIVED, entities});
export const fetchEntityMetas          = fetchEntityMetasBegin;

export const fetchEntitiesBegin     = ({smID} = {}) => ({type: FETCH_ENTITY_INSTANCES, smID});
export const fetchEntitiesCompleted = ({smID, entities}) => ({type: FETCH_ENTITY_INSTANCES_RECEIVED, smID, entities});
export const fetchEntities          = fetchEntitiesBegin;

export const declareEntityResolved = ({smEntity, _id}) => ({type: ENTITY_INSTANCE_RESOLVED, smEntity, _id});