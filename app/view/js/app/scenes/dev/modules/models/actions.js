import {MODELS} from "../../paths";
import axios from "axios"

// FETCHING ITEMS
export const FETCH_MODELS_RECEIVED = "FETCH_MODELS_RECEIVED";
export const fetchModelsBegin      = function () {
    return {
        type: "FETCH_MODELS_BEGIN",
    };
};
export const fetchModelsCompleted  = function (models) {
    return {
        type: FETCH_MODELS_RECEIVED,
        models
    };
};
export const fetchModels           = () => {
    return dispatch => {
        console.log('here');
        
        dispatch(fetchModelsBegin());
        
        return axios.get(MODELS)
                    .then(response => {
                        dispatch(fetchModelsCompleted(response && response.data && response.data));
                        return MODELS;
                    });
    }
};

// ACTIVATION
export const ACTIVATE_MODEL        = 'ACTIVATE_MODEL';
export const TOGGLE_ACTIVATE_MODEL = 'TOGGLE_ACTIVATE_MODEL';
export const DEACTIVATE_MODEL      = 'DEACTIVATE_MODEL';
export const activateModel         = ({smID}) => ({type: ACTIVATE_MODEL, smID});
export const toggleModelActivity   = ({smID}) => ({type: TOGGLE_ACTIVATE_MODEL, smID});
export const deactivateModel       = ({smID}) => ({type: DEACTIVATE_MODEL, smID});
