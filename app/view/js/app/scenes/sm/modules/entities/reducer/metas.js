import {FETCH_ENTITY_METAS_RECEIVED} from "../actions/types";
import {reduceEntriesIntoObject} from "../../../../../../utility";

type entityMeta = {
    smID: string,
    schematic: {},
    config: {},
    activeProperties: []
};
const metaReducer = (meta: entityMeta, action) => {
    let smID   = (meta || {}).smID;
    let {type} = action;
    
    switch (type) {
        case FETCH_ENTITY_METAS_RECEIVED:
            smID = (meta.schematic || {}).smID;
            meta = {...meta, smID};
            break;
        default:
            return meta || {};
    }
    
    meta.status = meta.status || {};
    
    return meta;
};
const metas       = (state, action) => {
    const {type} = action;
    switch (type) {
        case FETCH_ENTITY_METAS_RECEIVED:
            let fetched_entities = Object.entries(action.entities)
                                         .map(([smID, entity]) => [smID, metaReducer(entity, action)])
                                         .reduce(reduceEntriesIntoObject, {});
            return {...state, ...fetched_entities};
        default:
            return Object.entries(state || {})
                         .map(([smID, entity]) => [smID, metaReducer(entity, action)])
                         .reduce(reduceEntriesIntoObject, {});
    }
};
export default metas;