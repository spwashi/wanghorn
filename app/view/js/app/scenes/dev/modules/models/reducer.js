import {FETCH_MODELS_RECEIVED} from "./actions";

export const modelReducer =
                 (state, action) => {
                     switch (action.type) {
                         case FETCH_MODELS_RECEIVED:
                             const models = action.models;
                             return {models, list: Object.keys(models)};
                         default:
                             return state ? {...state} : {list: [], models: {}};
                     }
                 };