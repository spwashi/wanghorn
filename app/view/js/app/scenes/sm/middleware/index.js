import {FETCH_SM_ENTITIES, FETCH_SM_ENTITY_SCHEMATIC, FETCH_SM_ENTITY_SCHEMATIC_RECEIVED} from './../actions/types';
import axios from "axios";
import {selectSmContexts, selectSmSchematics} from "./../selector";
import {normalizeSmID, parseSmID} from "./../utility";
import {fetchSmEntitySchematic__received} from "./../actions";
import {fetchModels} from "../modules/models/actions/index";
import {FETCH_ENTITIES, FETCH_ENTITY_METAS} from "../modules/entities/actions/types";
import {fetchEntities, fetchEntitiesCompleted, fetchEntityMetasCompleted} from "../modules/entities/actions/actions";
import {fetchModelMetasCompleted, fetchModelsCompleted} from "../modules/models/actions";
import {getURI} from "../../../../path/resolution";
import {FETCH_MODEL_METAS_RECEIVED, FETCH_MODELS} from "../modules/models/actions/types";

export default [fetchSmEntitySchematicMiddleware, fetchSmEntitiesMiddleware];

const getSmID = function (originalSchematic) {
    let smEntity = originalSchematic;
    if (typeof  smEntity === 'object') smEntity = smEntity.smID;
    if (typeof smEntity !== 'string') {
        throw new Error('Cannot resolve from ', smEntity, originalSchematic);
    }
    let smID = smEntity;
    return smID;
};

const requestSmEntities = ({smID}, {state, dispatch}) => {
    let manager = parseSmID(smID).manager;
    
    if (typeof smID !== 'string') throw new Error("Can only find from smID");
    
    switch (manager) {
        case 'Model':
            const dispatchModelFetch = fetchModels({smID});
            dispatchModelFetch(dispatch);
            break;
        case 'Entity':
            const dispatchEntityFetch = fetchEntities({smID});
            dispatchEntityFetch(dispatch);
            break;
    }
};
const requestModels     = ({smID}, {state, dispatch}) => {
    const dispatchModelsReceived = response => {
        const models = response && response.data;
        dispatch(fetchModelsCompleted({models, smID}));
    };
    let {manager, name}          = parseSmID(smID);
    
    if (!manager === 'Model') {
        throw new Error("Can only fetch Models");
    }
    
    const uri = getURI('dev--all_models', {name});
    
    return axios.get(uri).then(response => dispatchModelsReceived(response));
};
const requestEntities   = ({smID}, {state, dispatch}) => {
    const dispatchEntitiesReceived = response => {
        const models = response && response.data;
        dispatch(fetchEntitiesCompleted({models, smID}));
    };
    let {manager, name}            = parseSmID(smID);
    
    if (!manager === 'Entity') {
        throw new Error("Can only fetch Entities");
    }
    
    const uri = getURI('dev--all_entities', {name});
    
    return axios.get(uri).then(response => dispatchEntitiesReceived(response));
};

function fetchSmEntitySchematicMiddleware(store) {
    return next => action => {
        next(action);
        
        const state = store.getState();
        
        switch (action.type) {
            case FETCH_MODEL_METAS_RECEIVED:
                axios.get(getURI("dev--entities__json")).then(response => store.dispatch(fetchEntityMetasCompleted(response && response.data && response.data)));
                return;
            case FETCH_ENTITY_METAS:
                axios.get(getURI("dev--entities__json")).then(response => store.dispatch(fetchModelMetasCompleted(response && response.data && response.data)));
                return;
            case FETCH_SM_ENTITY_SCHEMATIC:
                store.dispatch(fetchSmEntitySchematic__received());
                break;
            case FETCH_SM_ENTITY_SCHEMATIC_RECEIVED:
                let {contextName, smID}   = action;
                smID                      = getSmID(smID || action.schematic);
                const schematics          = selectSmSchematics(state);
                const contexts            = selectSmContexts(state);
                const {entities, models,} = schematics;
                
                const context = contextName && contexts[contextName] && contexts[contextName].schematics || {};
                let schematic = context[smID] || null;
                
                switch (parseSmID(smID).manager) {
                    case 'Model':
                        schematic = models[smID] || models[normalizeSmID(smID)];
                        break;
                    case 'Entity':
                        schematic = entities[smID] || entities[normalizeSmID(smID)];
                        break;
                }
                
                return schematic ? schematic : null;
        }
    };
}
function fetchSmEntitiesMiddleware(store) {
    return next => action => {
        next(action);
        
        const state    = store.getState();
        const dispatch = store.dispatch;
        
        switch (action.type) {
            case FETCH_MODELS:
                requestModels(action, {state, dispatch});
                break;
            case FETCH_ENTITIES:
                requestEntities(action, {state, dispatch});
                break;
            
            case FETCH_SM_ENTITIES:
                requestSmEntities(action, {state, dispatch});
                break;
        }
    };
}

