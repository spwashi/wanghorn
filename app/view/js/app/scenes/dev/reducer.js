import {combineReducers} from "redux";
import models from "./modules/models/reducer";
import entities from "./modules/entities/reducer";
import routes from "./modules/routes/reducer";

export default combineReducers({models, entities, routes});