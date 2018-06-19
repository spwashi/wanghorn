import {combineReducers} from "redux";
import metas             from "./metas";
import instances         from "./instances";

const entityReducer = combineReducers({metas, instances});
export default entityReducer;