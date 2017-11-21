import {combineReducers} from "redux";
import {reducer as schemaReducer} from "./components/Schema"
import {reducer as anchorReducer} from "./components/Anchor"
import * as actionTypes from './actionTypes'

export default combineReducers({
	                               anchors: (state, action) => {
		                               switch (action.type) {
			                               case actionTypes.CREATE_ANCHOR:
				                               const schema = anchorReducer(null, action);
				                               return [
					                               ...(state || []),
					                               schema
				                               ];
		                               }
		                               return []
	                               },
	                               schemas: (state, action) => {
		                               switch (action.type) {
			                               case actionTypes.CREATE_SCHEMA:
				                               const schema = schemaReducer(null, action);
				                               return [
					                               ...(state || []),
					                               schema
				                               ];
		                               }
		                               return []
	                               }
                               })