import {combineReducers} from "redux";
import metas from "../../../../sm/modules/entities/reducer/metas";
import {FETCH_ENTITY_METAS_RECEIVED} from "../../../../sm/modules/entities/actions/types";

let entitySmIDList_reducer = (state, {type, entities}) => {
    switch (type) {
        case FETCH_ENTITY_METAS_RECEIVED:
            return Object.keys(entities);
        default:
            return state || [];
    }
};
export default combineReducers({
                                   list:     entitySmIDList_reducer,
                                   entities: metas
                               });