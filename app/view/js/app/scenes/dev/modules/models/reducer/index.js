import {combineReducers} from "redux";
import modelMetaReducer from "../../../../sm/modules/models/reducer/metas";
import {FETCH_MODEL_METAS_RECEIVED} from "../../../../sm/modules/models/actions/types";

let modelSmIDList_reducer = (state, {type, models}) => {
    switch (type) {
        case FETCH_MODEL_METAS_RECEIVED:
            return Object.keys(models);
        default:
            return state || [];
    }
};
let modelMetas            = modelMetaReducer;
export default combineReducers({
                                   list:   modelSmIDList_reducer,
                                   models: modelMetas
                               });