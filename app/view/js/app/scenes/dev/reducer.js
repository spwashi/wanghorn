import {combineReducers} from "redux";
import {modelModuleReducer as models} from "./modules/sm/models/reducer";
import routes from "./modules/routes/reducer";

export default combineReducers({models, routes});