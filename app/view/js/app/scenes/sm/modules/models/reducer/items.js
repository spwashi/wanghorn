import {FETCH_MODELS_RECEIVED} from "../actions/types";

const modelReducer = (model, action) => {
    let {type} = action;
    
    switch (type) {
        case FETCH_MODELS_RECEIVED:
            return model;
        default:
            return model || {};
    }
};

const items = (state, action) => {
    const {type} = action;
    
    switch (type) {
        case FETCH_MODELS_RECEIVED:
            let {models, smID} = action;
            return {...state, [smID]: (models || []).map(model => modelReducer({...model}, action))};
        
        default:
            return {...(state || {})};
        
    }
};
export default items;