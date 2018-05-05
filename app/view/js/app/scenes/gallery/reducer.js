import React from "react"
import {combineReducers} from "redux";
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import {ACTIVATE_TAG, DEACTIVATE_TAG, FETCH_GALLERY_RECEIVED} from "./actions";
import {completeTag} from "./tags";

const correctItem =
          item => {
              item     = {...item};
              item.img = null;
              Object.entries(item.tags || {})
                    .forEach(([key, tags]) => {
                        let type       = key;
                        item.tags[key] = tags.map(config => completeTag(type,
                                                                        config));
                    });
              return item;
          };
let reducer       = combineReducers({
                                        activeTags:
                                            (tags, action) => {
                                                const {type, tag, category} = action;
                                                const currentTag            = {tag, category};
                                                switch (type) {
                                                    case DEACTIVATE_TAG:
                                                        return tags.filter(item => JSON.stringify(item) !== JSON.stringify(currentTag));
                                                    case ACTIVATE_TAG:
                                                        return [...tags, currentTag];
                                                    default:
                                                        return tags || [];
                                                }
                                            },
                                        items:
                                            (state, {type, items}) => {
                                                switch (type) {
                                                    case FETCH_GALLERY_RECEIVED:
                                                        return items.map(correctItem);
                                                    default:
                                                        return state || [];
                                                }
                                            }
                                    });
export default persistReducer({key: 'gallery', storage, blacklist: ['activeTags']}, reducer);