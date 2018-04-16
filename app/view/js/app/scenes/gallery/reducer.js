import React from "react"
import {combineReducers} from "redux";
import {FETCH_GALLERY_RECEIVED} from "./actions";
import {completeTag, TAG_TYPE__PROGRAMMING_LANGUAGE} from "./tags";

export default combineReducers({
                                   items: (state, action) => {
                                       switch (action.type) {
                                           case FETCH_GALLERY_RECEIVED:
                                               const {items} = action;
                                               items.forEach(item => {
                                                   if (item.asPerson) {
                                                       item.img = <div className={"image " + item.asPerson.toLowerCase()}></div>;
                                                   }
                                                   if (item.tags.languages) {
                                                       item.tags.languages = item.tags.languages.map(config => completeTag(TAG_TYPE__PROGRAMMING_LANGUAGE,
                                                                                                                           config));
                                                       console.log(item.tags.languages);
                                                   }
                                               });
                                               return items;
                                           default:
                                               return [];
                                       }
                                   }
                               });