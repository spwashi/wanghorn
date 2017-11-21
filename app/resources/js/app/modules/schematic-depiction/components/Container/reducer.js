import {combineReducers} from "redux";
import * as actions from "ContainerActions"

export default combineReducers({
                                   items: (state, action) => {
                                       switch (action.type) {
                                           case actions.ADD_ITEM:
                                               console.log(state, action);
                                               break;
                                       }
                                       console.log('here');
                                   }
                               });