import React from "react"
import {combineReducers} from "redux";
import {ACTIVATE_TAG, DEACTIVATE_TAG, FETCH_GALLERY_RECEIVED} from "./actions";
import {completeTag, TAG_TYPE__PROGRAMMING_LANGUAGE} from "./tags";

const correctItem =
          item => {
              item     = {...item};
              item.img = null;
              Object.entries(item.tags || {})
                    .forEach(([key, tags]) => {
                        let type       = key === 'languages' ? TAG_TYPE__PROGRAMMING_LANGUAGE : key;
                        item.tags[key] = tags.map(config => completeTag(type,
                                                                        config));
                    });
              return item;
          };
export default combineReducers({
                                   activeTags:
                                       (tags, {type, tag, category}) => {
                                           const currentTag = {tag, category};
                                           switch (type) {
                                               case DEACTIVATE_TAG:
                                                   return tags.filter(item => JSON.stringify(item) !== JSON.stringify(currentTag));
                                               case ACTIVATE_TAG:
                                                   console.log({type, tag, category});
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