import {combineReducers} from "redux";
import {modelModuleReducer as models} from "./modules/sm/models/reducer";

export default combineReducers({models});