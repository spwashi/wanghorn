import {combineReducers} from "redux";
import scenes from "./scenes/reducer";
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import session from './services/session/reducer'

const reducer = combineReducers({
                                    scenes,
                                    session
                                });
export default persistReducer({
                                  key:             'root',
                                  stateReconciler: hardSet,
                                  storage,
                              }, reducer);