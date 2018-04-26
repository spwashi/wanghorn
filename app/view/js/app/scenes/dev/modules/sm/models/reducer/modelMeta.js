import {ACTIVATE_MODEL_PROPERTY, DEACTIVATE_MODEL_PROPERTY, EXECUTE_MODEL_QUERY__END, FETCH_MODELS_RECEIVED, TOGGLE_ACTIVATE_MODEL_PROPERTY} from "../actions";
import {normalizeSmID} from "../../../sm/utility";
import {selectActiveProperties_fromModelMetaObject, selectPropertySmIDs_fromModel} from "../selector";

type modelMeta = {
    smID: string,
    alterTableStatements: [],
    createTableStatement: string,
    model: {},
    tableExists: boolean,
    activeProperties: []
};

function activePropertyReducer(activeProperties = [], {smID, type}) {
    smID                   = normalizeSmID(smID);
    let deactivateProperty = () => activeProperties.filter(item => item !== smID);
    let activateProperty   = () => [...new Set([...activeProperties, smID])];
    switch (type) {
        case ACTIVATE_MODEL_PROPERTY:
            return activateProperty();
        case TOGGLE_ACTIVATE_MODEL_PROPERTY:
            return activeProperties.indexOf(smID) < 0 ? activateProperty()
                                                      : deactivateProperty();
        case DEACTIVATE_MODEL_PROPERTY:
            return deactivateProperty();
        default:
            return activeProperties;
    }
}

let reduceActiveProperties = ({action, modelMeta}) => {
    const prev_activeProperties = selectActiveProperties_fromModelMetaObject(modelMeta);
    let actionType              = action.type;
    
    switch (actionType) {
        case ACTIVATE_MODEL_PROPERTY:
        case TOGGLE_ACTIVATE_MODEL_PROPERTY:
        case DEACTIVATE_MODEL_PROPERTY:
            let model = modelMeta.model;
            
            const propertySmID     = normalizeSmID(action.smID);
            const allPropertySmIDs = selectPropertySmIDs_fromModel(model);
            
            if (allPropertySmIDs.indexOf(propertySmID) < 0) {
                // This is not in the Model
                break;
            }
            
            return activePropertyReducer(prev_activeProperties, {smID: propertySmID, type: actionType});
    }
    return prev_activeProperties || [];
};
export default (modelMeta: modelMeta, action) => {
    let smID                  = (modelMeta || {}).smID;
    let prev_activeProperties = selectActiveProperties_fromModelMetaObject(modelMeta);
    let activeProperties      = reduceActiveProperties({action, modelMeta, prev_activeProperties});
    
    if (activeProperties !== prev_activeProperties) modelMeta = {...modelMeta, activeProperties};
    
    switch (action.type) {
        case FETCH_MODELS_RECEIVED:
            smID = (modelMeta.model || {}).smID;
            return {...modelMeta, smID};
        case EXECUTE_MODEL_QUERY__END:
            const {query, result} = action;
            
            if (smID !== action.smID) return modelMeta;
            
            let success = result && result.success;
            
            console.log(`Attempted to ${query} on ${smID} -- was${success ? '' : ' NOT'} successful`);
            
            modelMeta = {...modelMeta};
            
            if (query === 'CREATE_TABLE') {
                modelMeta.tableExists = !!success;
            }
            
            return modelMeta;
        default:
            return modelMeta || {};
    }
}
