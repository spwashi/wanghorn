import {FETCH_ENTITIES, FETCH_ENTITIES_RECEIVED, FETCH_ENTITY_METAS, FETCH_ENTITY_METAS_RECEIVED} from "./types";

export const fetchEntityMetasBegin     = () => ({type: FETCH_ENTITY_METAS,});
export const fetchEntityMetasCompleted = entities => ({type: FETCH_ENTITY_METAS_RECEIVED, entities});
export const fetchEntityMetas          = fetchEntityMetasBegin;

export const fetchEntitiesBegin     = ({smID} = {}) => ({type: FETCH_ENTITIES, smID});
export const fetchEntitiesCompleted = entities => ({type: FETCH_ENTITIES_RECEIVED, entities});
export const fetchEntities          = fetchEntitiesBegin;