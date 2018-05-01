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
        return axios.get(getURI("dev--execute_query", {smID, query}))
                    .then(response =>
                              dispatch(executeModelQueryEnd({
                                                                smID,
                                                                query,
                                                                result: response && response.data && response.data
                                                            })
                              )
                    );
    };

// ACTIVATION
export const ACTIVATE_MODEL        = 'ACTIVATE_MODEL';
export const TOGGLE_ACTIVATE_MODEL = 'TOGGLE_ACTIVATE_MODEL';
export const DEACTIVATE_MODEL      = 'DEACTIVATE_MODEL';
export const activateModel         = ({smID}) => ({type: ACTIVATE_MODEL, smID});
export const toggleModelActivity   = ({smID}) => ({type: TOGGLE_ACTIVATE_MODEL, smID});
export const deactivateModel       = ({smID}) => ({type: DEACTIVATE_MODEL, smID});

// EDITING
export const OPEN_MODEL_EDIT        = "OPEN_MODEL_EDIT";
export const CLOSE_MODEL_EDIT       = "CLOSE_MODEL_EDIT";
export const openModelCreateDialog  = ({smID}) => ({type: OPEN_MODEL_EDIT, smID});
export const closeModelCreateDialog = ({smID}) => ({type: CLOSE_MODEL_EDIT, smID});

export const TOGGLE_MODEL_SCENE_ACTIVITY = "TOGGLE_MODEL_SCENE_ACTIVITY";
export const toggleModelScene            = () => ({type: TOGGLE_MODEL_SCENE_ACTIVITY});

export const ACTIVATE_MODEL_PROPERTY        = 'ACTIVATE_MODEL_PROPERTY';
export const TOGGLE_ACTIVATE_MODEL_PROPERTY = 'TOGGLE_ACTIVATE_MODEL_PROPERTY';
export const DEACTIVATE_MODEL_PROPERTY      = 'DEACTIVATE_MODEL_PROPERTY';
export const activateModelProperty          = ({smID}) => ({type: ACTIVATE_MODEL_PROPERTY, smID});
export const toggleModelPropertyActivity    = ({smID}) => ({type: TOGGLE_ACTIVATE_MODEL_PROPERTY, smID});
export const deactivateModelProperty        = ({smID}) => ({type: DEACTIVATE_MODEL_PROPERTY, smID});
