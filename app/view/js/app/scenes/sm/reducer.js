import {combineReducers} from "redux";
import {CONTEXT_RESOLVED} from "./actions";

export default combineReducers({
                                   contexts: (state, action) => {
                                       switch (action.type) {
                                           case CONTEXT_RESOLVED:
                                               let context = action.context;
                                               if (!context) {
                                                   console.log("mmalformed context");
                                                   return state;
                                               }
                                               let name = context.name;
                                               return {...state, [name]: context};
                                           default:
                                               return state || {};
                                       }
                                   }
                               })