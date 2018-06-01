import {FETCH_ENTITY_METAS_RECEIVED} from "../../modules/entities/actions/types";
// Configurations for the Entities used in this application
export default (state, action) => {
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
};
