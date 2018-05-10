import {combineReducers} from "redux";
import {modelModuleReducer as models} from "./modules/sm/models/reducer";
import routes from "./modules/routes/reducer";
import session from "./modules/session/reducer";

export default combineReducers({models, routes, session});