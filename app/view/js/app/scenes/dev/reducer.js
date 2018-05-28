import {combineReducers} from "redux";
import models from "./modules/sm/models/reducer";
import entities from "./modules/sm/entities/reducer";
import routes from "./modules/routes/reducer";

export default combineReducers({models, entities, routes});