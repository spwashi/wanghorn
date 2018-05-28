import {FETCH_ENTITY_METAS_RECEIVED, TOGGLE_ENTITY_SCENE_ACTIVITY} from "../actions";
import {combineReducers} from "redux";
import {reduceEntriesIntoObject} from "../../../../../../../utility";
import entityMetaReducer from "./entityMeta";

let entitySmIDList_reducer = (state, {type, entities}) => {
    switch (type) {
        case FETCH_ENTITY_METAS_RECEIVED:
            return Object.keys(entities);
        default:
            return state || [];
    }
};
let entityObject_reducer   = (state, action) => {
    const {type} = action;
    switch (type) {
        case FETCH_ENTITY_METAS_RECEIVED:
            let fetched_entities = Object.entries(action.entities)
                                         .map(([smID, entity]) => [smID, entityMetaReducer(entity, action)])
                                         .reduce(reduceEntriesIntoObject, {});
            return {...state, ...fetched_entities};
        default:
            return Object.entries(state || {})
                         .map(([smID, entity]) => [smID, entityMetaReducer(entity, action)])
                         .reduce(reduceEntriesIntoObject, {});
    }
};
export default combineReducers({
                                   isActive: (state, action) => {
                                       switch (action.type) {
                                           case TOGGLE_ENTITY_SCENE_ACTIVITY:
                                               return !state;
                                           default:
                                               return state || false;
                                       }
                                   },
                                   list:     entitySmIDList_reducer,
                                   entities: entityObject_reducer
                               });