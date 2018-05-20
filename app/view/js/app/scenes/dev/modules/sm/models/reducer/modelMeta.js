import {EXECUTE_MODEL_QUERY__END, FETCH_MODELS_RECEIVED} from "../actions";

type modelMeta = {
    smID: string,
    alterTableStatements: [],
    createTableStatement: string,
    model: {},
    tableExists: boolean,
    activeProperties: []
};

export default (modelMeta: modelMeta, action) => {
    let smID = (modelMeta || {}).smID;
    
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
