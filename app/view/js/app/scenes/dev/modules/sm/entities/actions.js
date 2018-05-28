import {ENTITIES} from "../../../paths";
import axios from "axios"
import {getURI} from "../../../../../../path/resolution";
import {parseSmID} from "../utility";

// FETCHING ITEMS
export const FETCH_ENTITY_METAS_RECEIVED = "FETCH_ENTITY_METAS_RECEIVED";
export const fetchEntityMetasBegin       = () => ({type: "FETCH_ENTITY_METAS_BEGIN",});
export const fetchEntityMetasCompleted   = entities => ({type: FETCH_ENTITY_METAS_RECEIVED, entities});
export const fetchEntityMetas            = () =>
    dispatch => {
        dispatch(fetchEntityMetasBegin());
        
        return axios.get(ENTITIES)
                    .then(response => dispatch(fetchEntityMetasCompleted(response && response.data && response.data)));
    };

export const FETCH_ENTITIES_RECEIVED = "FETCH_ENTITIES_RECEIVED";
export const fetchEntitiesBegin      = () => ({type: "FETCH_ENTITIES_BEGIN",});
export const fetchEntitiesCompleted  = entities => ({type: FETCH_ENTITIES_RECEIVED, entities});
export const fetchEntities           = ({smID}) =>
    dispatch => {
        dispatch(fetchEntitiesBegin());
        let {manager, name, owner} = parseSmID(smID);
        
        if (!manager === 'Entity') throw new Error("Can only fetch Entities");
        
        return axios.get(getURI('dev--all_entities', {name}))
                    .then(response => dispatch(fetchEntitiesCompleted(response && response.data && response.data)));
    };

// QUERY EXECUTION
export const EXECUTE_ENTITY_QUERY__END = 'EXECUTE_ENTITY_QUERY__END';
const executeEntityQueryBegin          = ({smID, query}) => ({type: 'EXECUTE_ENTITY_QUERY__BEGIN', smID, query});
const executeEntityQueryEnd            = ({smID, query, result}) => ({type: EXECUTE_ENTITY_QUERY__END, smID, query, result});
export const executeEntityQuery        = ({smID, query}) =>
    dispatch => {
        dispatch(executeEntityQueryBegin({smID, query}));
        return axios.get(getURI("dev--execute_query", {smID, query}) + '?run')
                    .then(response =>
                              dispatch(executeEntityQueryEnd({
                                                                smID,
                                                                query,
                                                                result: response && response.data && response.data
                                                            })
                              )
                    );
    };

export const TOGGLE_ENTITY_SCENE_ACTIVITY = "TOGGLE_ENTITY_SCENE_ACTIVITY";
export const toggleEntityScene            = () => ({type: TOGGLE_ENTITY_SCENE_ACTIVITY});