import React from "react"
import {combineReducers} from "redux";
import {FETCH_GALLERY_RECEIVED} from "./actions";

export default combineReducers({
                                   items: (state, action) => {
                                       switch (action.type) {
                                           case FETCH_GALLERY_RECEIVED:
                                               const {items} = action;
                                               return items;
                                           default:
                                               return [];
                                       }
                                   }
                               });