import {combineReducers} from "redux";
import schematics        from "./schematics";
import contexts          from "./contexts";
import managers          from "./managers";

export default combineReducers({
	                               schematics,
	                               contexts,
	                               managers
                               })