import {MODELS} from "../../../paths";
import axios from "axios"
import {getURI} from "../../../../../../path/resolution";

// FETCHING ITEMS
export const FETCH_MODELS_RECEIVED = "FETCH_MODELS_RECEIVED";
export const fetchModelsBegin      = () => ({type: "FETCH_MODELS_BEGIN",});
export const fetchModelsCompleted  = models => ({type: FETCH_MODELS_RECEIVED, models});
export const fetchModels           = () =>
    dispatch => {
        dispatch(fetchModelsBegin());
        
        return axios.get(MODELS)
                    .then(response => dispatch(fetchModelsCompleted(response && response.data && response.data)));
    };

// QUERY EXECUTION
export const EXECUTE_MODEL_QUERY__END = 'EXECUTE_MODEL_QUERY__END';
const executeModelQueryBegin          = ({smID, query}) => ({type: 'EXECUTE_MODEL_QUERY__BEGIN', smID, query});
const executeModelQueryEnd            = ({smID, query, result}) => ({type: EXECUTE_MODEL_QUERY__END, smID, query, result});
export const executeModelQuery        = ({smID, query}) =>
    dispatch => {
        dispatch(executeModelQueryBegin({smID, query}));
        return axios.get(getURI("dev--execute_query", {smID, query}) + '?run')
                    .then(response =>
                              dispatch(executeModelQueryEnd({
                                                                smID,
                                                                query,
                                                                result: response && response.data && response.data
                                                            })
                              )
                    );
    };

export const TOGGLE_MODEL_SCENE_ACTIVITY = "TOGGLE_MODEL_SCENE_ACTIVITY";
export const toggleModelScene            = () => ({type: TOGGLE_MODEL_SCENE_ACTIVITY});