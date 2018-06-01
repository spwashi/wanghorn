import {reduceEntriesIntoObject} from "../../../../../../utility";
import {EXECUTE_MODEL_QUERY__END} from "../actions/types";
import {FETCH_MODEL_METAS_RECEIVED} from "../actions/types";

type modelMeta = {
    smID: string,
    alterTableStatements: [],
    createTableStatement: string,
    schematic: {},
    config: {},
    tableExists: boolean,
    activeProperties: []
};
const metaReducer = (meta: modelMeta, action) => {
    let smID   = (meta || {}).smID;
    let {type} = action;
    
    switch (type) {
        case FETCH_MODEL_METAS_RECEIVED:
            smID = (meta.schematic || {}).smID;
            meta = {...meta, smID};
            break;
        case EXECUTE_MODEL_QUERY__END:
            const {query, result} = action;
            
            if (smID !== action.smID) return meta;
            
            let success = result && result.success;
            console.log(`Attempted to ${query} on ${smID} -- was${success ? '' : ' NOT'} successful`);
            
            meta = {...meta};
            if (query === 'CREATE_TABLE') meta.tableExists = !!success;
            break;
        default:
            return meta || {};
    }
    
    const {createTableStatement, tableExists} = meta || {};
    meta                                      = meta || {};
    meta.status                               = {
        canCreateTable: (!tableExists) && !!createTableStatement && !!createTableStatement.length,
        tableExists:    !!tableExists
    };
    
    return meta;
};
const metas       = (state, action) => {
    const {type} = action;
    
    switch (type) {
        case FETCH_MODEL_METAS_RECEIVED:
            let {models} = action;
            
            let fetched_models = Object.entries(models)
                                       .map(([smID, entity]) => [smID, metaReducer(entity, action)])
                                       .reduce(reduceEntriesIntoObject, {});
            
            return {...state, ...fetched_models};
        
        default:
            return Object.entries(state || {})
                         .map(([smID, entity]) => [smID, metaReducer(entity, action)])
                         .reduce(reduceEntriesIntoObject, {});
    }
}
export default metas;