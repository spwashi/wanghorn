import {combineReducers} from "redux";
import {reducer as dev} from "./dev";
import gallery from "./gallery/reducer";
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'

let reducer = combineReducers({
                                  dev: persistReducer({key: 'dev', storage, stateReconciler: hardSet},
                                                      dev),
                                  gallery
                              });
export default reducer;
