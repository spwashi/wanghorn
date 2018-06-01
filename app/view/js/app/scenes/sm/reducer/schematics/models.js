import {FETCH_MODEL_METAS_RECEIVED} from "../../modules/models/actions/types";

// Configurations for the Models used in this application
export default (state, action) => {
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
};