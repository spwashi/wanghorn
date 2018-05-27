import {FETCH_MODEL_METAS_RECEIVED, TOGGLE_MODEL_SCENE_ACTIVITY} from "../actions";
import {combineReducers} from "redux";
import {reduceEntriesIntoObject} from "../../../../../../../utility";
import modelMetaReducer from "./modelMeta";

let modelSmIDList_reducer       = (state, {type, models}) => {
    switch (type) {
        case FETCH_MODEL_METAS_RECEIVED:
            return Object.keys(models);
        default:
            return state || [];
    }
};
let modelObject_reducer         = (state, action) => {
    const {type} = action;
    switch (type) {
        case FETCH_MODEL_METAS_RECEIVED:
            let fetched_models = Object.entries(action.models)
                                       .map(([smID, model]) => [smID, modelMetaReducer(model, action)])
                                       .reduce(reduceEntriesIntoObject, {});
            return {...state, ...fetched_models};
        default:
            return Object.entries(state || {})
                         .map(([smID, model]) => [smID, modelMetaReducer(model, action)])
                         .reduce(reduceEntriesIntoObject, {});
    }
};
export const modelModuleReducer = combineReducers({
                                                      isActive: (state, action) => {
                                                          switch (action.type) {
                                                              case TOGGLE_MODEL_SCENE_ACTIVITY:
                                                                  return !state;
                                                              default:
                                                                  return state || false;
                                                          }
                                                      },
                                                      list:     modelSmIDList_reducer,
                                                      models:   modelObject_reducer
                                                  });