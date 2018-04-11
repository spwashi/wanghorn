import {MODELS} from "../../paths";
import axios from "axios"

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
export const fetchModels           =
                 () => {
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
