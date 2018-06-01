import {combineReducers} from "redux";
import metas from "./metas";
import items from "./items";

const modelModuleReducer = combineReducers({metas, items});
export default modelModuleReducer;