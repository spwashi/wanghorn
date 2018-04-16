import {combineReducers} from "redux";
import {reducer as dev} from "./dev";
import gallery from "./gallery/reducer";

export default combineReducers({dev, gallery});