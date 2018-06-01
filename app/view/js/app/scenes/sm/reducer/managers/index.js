import {combineReducers} from "redux";
import entityReducer from "../../modules/entities/reducer";
import modelModuleReducer from "../../modules/models/reducer";

const managers = combineReducers({models: modelModuleReducer, entities: entityReducer});
export default managers;