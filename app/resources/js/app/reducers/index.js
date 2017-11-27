import schematicDepiction from '../modules/schematic-depiction';
import {combineReducers} from "redux";

export default combineReducers({
                                   [schematicDepiction.constants.NAME]: schematicDepiction.reducer
                               });