import {combineReducers} from "redux";
import {ATTEMPT_LOGIN_RECEIVED} from "./actions";

export default combineReducers({
                                   activeUser: (state, action) => {
                                       switch (action.type) {
                                           case ATTEMPT_LOGIN_RECEIVED:
                                               if (action.success) return action.user;
                                               return null;
                                           default:
                                               return state || null;
                                       }
                                   }
                               })