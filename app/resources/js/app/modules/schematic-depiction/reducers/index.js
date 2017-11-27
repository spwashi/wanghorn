import {combineReducers} from "redux";
import * as ConceptModule from "../modules/Concept"
import {default as anchors} from './anchors'

export default combineReducers({
                                   anchors,
                                   concepts: ConceptModule.reducer
                               })