import {ACTIVATE_MODEL, DEACTIVATE_MODEL, FETCH_MODELS_RECEIVED, TOGGLE_ACTIVATE_MODEL} from "./actions";
import {combineReducers} from "redux";

function activeSmIDs(state, action) {
    const {type, models} = action;
    const {smID}         = action;
    switch (type) {
        // case FETCH_MODELS_RECEIVED:
        //     return Object.keys(models);
        case TOGGLE_ACTIVATE_MODEL:
            return state.indexOf(smID) > -1 ? activeSmIDs(state, {...action, type: DEACTIVATE_MODEL})
                                            : activeSmIDs(state, {...action, type: ACTIVATE_MODEL});
        case DEACTIVATE_MODEL:
            return state.filter(item => item !== smID);
        case ACTIVATE_MODEL:
            return [...new Set([...state, smID])];
        default :
            return state || [];
    }
}
export const modelReducer = combineReducers({
                                                activeSmIDs,
                                                list:   (state, {type, models}) => {
                                                    switch (type) {
                                                        case FETCH_MODELS_RECEIVED:
                                                            return Object.keys(models);
                                                        default:
                                                            return state || [];
                                                    }
                                                },
                                                models: (state, {type, models}) => {
                                                    switch (type) {
                                                        case FETCH_MODELS_RECEIVED:
                                                            return models;
                                                        default:
                                                            return state || {};
                                                    }
                                                }
                                            });