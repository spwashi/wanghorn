import {combineReducers} from "redux";
import entityModuleReducer from "../../modules/entities/reducer";
import modelModuleReducer from "../../modules/models/reducer";

const managers = combineReducers({models: modelModuleReducer, entities: entityModuleReducer});
export default managers;