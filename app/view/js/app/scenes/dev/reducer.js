import {combineReducers} from "redux";
import {modelModuleReducer as models} from "./modules/models/reducer/index";

export default combineReducers({models});