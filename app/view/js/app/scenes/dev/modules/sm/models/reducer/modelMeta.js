import {EXECUTE_MODEL_QUERY__END, FETCH_MODEL_METAS_RECEIVED} from "../actions";

type modelMeta = {
    smID: string,
    alterTableStatements: [],
    createTableStatement: string,
    schematic: {},
    tableExists: boolean,
    activeProperties: []
};

export default (modelMeta: modelMeta, action) => {
    let smID = (modelMeta || {}).smID;
    
    switch (action.type) {
        case FETCH_MODEL_METAS_RECEIVED:
            smID      = (modelMeta.schematic || {}).smID;
            modelMeta = {...modelMeta, smID};
            break;
        case EXECUTE_MODEL_QUERY__END:
            const {query, result} = action;
            
            if (smID !== action.smID) return modelMeta;
            
            let success = result && result.success;
            console.log(`Attempted to ${query} on ${smID} -- was${success ? '' : ' NOT'} successful`);
            
            modelMeta = {...modelMeta};
            if (query === 'CREATE_TABLE') modelMeta.tableExists = !!success;
            break;
        default:
            return modelMeta || {};
    }
    
    const {createTableStatement, tableExists} = modelMeta || {};
    modelMeta                                 = modelMeta || {};
    modelMeta.status                          = {
        canCreateTable: (!tableExists) && !!createTableStatement && !!createTableStatement.length,
        tableExists:    !!tableExists
    };
    
    return modelMeta;
}
