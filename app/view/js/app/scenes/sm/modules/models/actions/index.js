import {EXECUTE_MODEL_QUERY__END, FETCH_MODEL_METAS, FETCH_MODEL_METAS_RECEIVED, FETCH_MODELS, FETCH_MODELS_RECEIVED} from "./types";
import axios from "axios/index";
import {getURI} from "../../../../../../path/resolution";

export const fetchModelsBegin     = ({smID}) => ({type: FETCH_MODELS, smID});
export const fetchModelsCompleted = ({models, smID}) => ({type: FETCH_MODELS_RECEIVED, models, smID});
export const fetchModels          = fetchModelsBegin;

export const fetchModelMetasBegin     = () => ({type: FETCH_MODEL_METAS,});
export const fetchModelMetasCompleted = models => ({type: FETCH_MODEL_METAS_RECEIVED, models});
export const fetchModelMetas          = fetchModelMetasBegin;


const executeModelQueryBegin   = ({smID, query}) => ({type: 'EXECUTE_MODEL_QUERY__BEGIN', smID, query});
const executeModelQueryEnd     = ({smID, query, result}) => ({type: EXECUTE_MODEL_QUERY__END, smID, query, result});
export const executeModelQuery = ({smID, query}) =>
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
