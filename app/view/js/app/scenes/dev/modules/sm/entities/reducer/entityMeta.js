import {EXECUTE_ENTITY_QUERY__END, FETCH_ENTITY_METAS_RECEIVED} from "../actions";

type entityMeta = {
    smID: string,
    alterTableStatements: [],
    createTableStatement: string,
    entity: {},
    tableExists: boolean,
    activeProperties: []
};

export default (entityMeta: entityMeta, action) => {
    let smID = (entityMeta || {}).smID;
    
    switch (action.type) {
        case FETCH_ENTITY_METAS_RECEIVED:
            smID = (entityMeta.entity || {}).smID;
            return {...entityMeta, smID};
        case EXECUTE_ENTITY_QUERY__END:
            const {query, result} = action;
            
            if (smID !== action.smID) return entityMeta;
            
            let success = result && result.success;
            
            console.log(`Attempted to ${query} on ${smID} -- was${success ? '' : ' NOT'} successful`);
            
            entityMeta = {...entityMeta};
            
            if (query === 'CREATE_TABLE') {
                entityMeta.tableExists = !!success;
            }
            
            return entityMeta;
        default:
            return entityMeta || {};
    }
}
