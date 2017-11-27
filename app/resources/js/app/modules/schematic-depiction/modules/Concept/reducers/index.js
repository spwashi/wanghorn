import {combineReducers} from "redux";
import * as conceptActionTypes from '../actionTypes'

export default combineReducers({
                                   concepts: (state = {}, action) => {
                                       switch (action.type) {
                                           case conceptActionTypes.INIT_CONCEPT:
                                               break;
                                           default:
                                               return state;
                                       }
                                   }
                               });