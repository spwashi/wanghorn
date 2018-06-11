import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import {combineReducers} from "redux";
import {ACTIVE_USER_FOUND} from "./actions";

let reducer = combineReducers({
                                  activeUser: (state, action) => {
                                      switch (action.type) {
                                          case ACTIVE_USER_FOUND:
                                              console.log(action);
                                              return action.user;
                                          default:
                                              return state || null;
                                      }
                                  }
                              });
export default persistReducer({key: 'session', stateReconciler: hardSet, blacklist: ['activeUser'], storage}, reducer)