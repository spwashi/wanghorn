import {ACTIVATE_MODEL, DEACTIVATE_MODEL, EXECUTE_MODEL_QUERY__END, FETCH_MODELS_RECEIVED, TOGGLE_ACTIVATE_MODEL} from "./actions";
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
                                                models: (state, action) => {
                                                    const {type, models} = action;
                                                    switch (type) {
                                                        case FETCH_MODELS_RECEIVED:
                                                            return models;
                                                        case EXECUTE_MODEL_QUERY__END:
                                                            const {smID, query, result} = action;
                                                            alert(`Attempted to ${query} on ${smID} -- was${result && result.success ? '' : ' NOT'} successful`);
                                                            if (query === 'CREATE_TABLE') {
                                                                const createTableModel       = state[smID];
                                                                createTableModel.tableExists = result.success;
                                                                console.log(createTableModel);
                                                            }
                                                            return {...state};
                                                        default:
                                                            return state || {};
                                                    }
                                                }
                                            });