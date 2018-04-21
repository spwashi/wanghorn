import {ACTIVATE_MODEL, DEACTIVATE_MODEL, FETCH_MODELS_RECEIVED, TOGGLE_ACTIVATE_MODEL} from "../actions";
import {combineReducers} from "redux";
import {reduceEntriesIntoObject} from "../../../../../../utility";
import devComponentReducer from "./devComponent";

function activeSmID_reducer(state, action) {
    const {type, models} = action;
    const {smID}         = action;
    switch (type) {
        // case FETCH_MODELS_RECEIVED:
        //     return Object.keys(models);
        case TOGGLE_ACTIVATE_MODEL:
            console.log(state);
            return state.indexOf(smID) > -1 ? activeSmID_reducer(state, {...action, type: DEACTIVATE_MODEL})
                                            : activeSmID_reducer(state, {...action, type: ACTIVATE_MODEL});
        case DEACTIVATE_MODEL:
            return state.filter(item => item !== smID);
        case ACTIVATE_MODEL:
            return [...new Set([...state, smID])];
        default :
            return state || [];
    }
}
let modelSmIDList_reducer       = (state, {type, models}) => {
    switch (type) {
        case FETCH_MODELS_RECEIVED:
            return Object.keys(models);
        default:
            return state || [];
    }
};
let modelObject_reducer         = (state, action) => {
    const {type, models} = action;
    switch (type) {
        case FETCH_MODELS_RECEIVED:
            return Object.entries(action.models)
                         .map(([smID, model]) => [smID, devComponentReducer(model, action)])
                         .reduce(reduceEntriesIntoObject, {});
        default:
            return Object.entries(state || {})
                         .map(([smID, model]) => [smID, devComponentReducer(model, action)])
                         .reduce(reduceEntriesIntoObject, {});
    }
};
export const modelModuleReducer = combineReducers({
                                                      activeSmIDs: activeSmID_reducer,
                                                      list:        modelSmIDList_reducer,
                                                      models:      modelObject_reducer
                                                  });