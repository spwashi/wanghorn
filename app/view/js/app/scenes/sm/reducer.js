import {combineReducers} from "redux";
import {CONTEXT_RESOLVED} from "./actions";
import {FETCH_MODEL_METAS_RECEIVED} from "../dev/modules/sm/models/actions";
import {FETCH_ENTITY_METAS_RECEIVED} from "../dev/modules/sm/entities/actions";

export default combineReducers({
                                   // Configurations for the Models used in this SmEntity
                                   models:   (state, action) => {
                                       switch (action.type) {
                                           case FETCH_MODEL_METAS_RECEIVED:
                                               let models     = action.models;
                                               let schematics = {};
                                               Object.entries(models)
                                                     .forEach(entry => {
                                                         let [name, modelMeta] = entry;
                    
                                                         // Configuration from SmPHP
                                                         let {schematic}            = modelMeta;
                                                         schematics[schematic.smID] = schematic;
                                                     });
                
                                               return {...state, ...schematics};
                                           default:
                                               return state || {};
                                       }
                                   },
                                   entities: (state, action) => {
                                       switch (action.type) {
                                           case FETCH_ENTITY_METAS_RECEIVED:
                                               let entities   = action.entities;
                                               let schematics = {};
                                               Object.entries(entities)
                                                     .forEach(entry => {
                                                         let [name, entityMeta]     = entry;
                                                         // Configuration from SmPHP
                                                         let {schematic}            = entityMeta;
                                                         schematics[schematic.smID] = schematic;
                                                     });
                
                                               return {...state, ...schematics};
                                           default:
                                               return state || {};
                                       }
                                   },
    
                                   // Contexts contain the schematics of smEntities that exist within them
                                   contexts: (state, action) => {
                                       switch (action.type) {
                                           case CONTEXT_RESOLVED:
                                               let context = action.context;
                
                                               if (!context) {
                                                   console.error("malformed context", context);
                                                   return state;
                                               }
                
                                               let name = context.name;
                                               return {...state, [name]: context};
            
                                           default:
                                               return state || {};
                                       }
                                   }
                               })