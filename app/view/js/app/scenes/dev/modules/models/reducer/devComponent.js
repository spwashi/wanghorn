import {ACTIVATE_MODEL_PROPERTY, DEACTIVATE_MODEL_PROPERTY, EXECUTE_MODEL_QUERY__END, FETCH_MODELS_RECEIVED, TOGGLE_ACTIVATE_MODEL_PROPERTY} from "../actions";

type modelDevObj = {
    smID: string,
    alterTableStatements: [],
    createTableStatement: string,
    model: {},
    tableExists: boolean,
    activeProperties: []
};

function activePropertyReducer(activeProperties, {smID, type}) {
    let deactivateProperty = () => activeProperties.filter(item => item !== smID);
    let activateProperty   = function () {
        return [...new Set([...activeProperties, smID])];
    };
    switch (type) {
        case ACTIVATE_MODEL_PROPERTY:
            return activateProperty();
        case TOGGLE_ACTIVATE_MODEL_PROPERTY:
            return activeProperties.indexOf(smID) < 0 ? activateProperty()
                                                      : deactivateProperty();
        case DEACTIVATE_MODEL_PROPERTY:
            return deactivateProperty();
        default:
            return activeProperties || [];
    }
}

export default (devComponent: modelDevObj, action) => {
    let smID = (devComponent || {}).smID;
    
    switch (action.type) {
        case ACTIVATE_MODEL_PROPERTY:
        case TOGGLE_ACTIVATE_MODEL_PROPERTY:
        case DEACTIVATE_MODEL_PROPERTY:
            const propertySmID = action.smID;
            
            // Property does not belong to model
            if (propertySmID.indexOf(smID) < 0) return devComponent;
            
            return {
                ...devComponent,
                activeProperties: activePropertyReducer(devComponent.activeProperties, action)
            };
        case FETCH_MODELS_RECEIVED:
            smID = (devComponent.model || {}).smID;
            return {...devComponent, smID};
        case EXECUTE_MODEL_QUERY__END:
            const {query, result} = action;
            
            if (smID !== action.smID) return devComponent;
            
            let success = result && result.success;
            
            alert(`Attempted to ${query} on ${smID} -- was${success ? '' : ' NOT'} successful`);
            
            devComponent = {...devComponent};
            
            if (query === 'CREATE_TABLE') {
                devComponent.tableExists = !!success;
            }
            
            return devComponent;
        default:
            return devComponent || {};
    }
}
