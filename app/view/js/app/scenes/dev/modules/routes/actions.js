import axios from "axios"
import {ROUTES} from "../../paths";

// FETCHING ITEMS
export const FETCH_ROUTES_RECEIVED = "FETCH_ROUTES_RECEIVED";
export const fetchRoutesBegin      = () => ({type: "FETCH_ROUTES_BEGIN",});
export const fetchRoutesCompleted  = routes => ({type: FETCH_ROUTES_RECEIVED, routes});
export const fetchRoutes           = () =>
    dispatch => {
        dispatch(fetchRoutesBegin());
        
        return axios.get(ROUTES)
                    .then(response => dispatch(fetchRoutesCompleted(response && response.data && response.data)));
    };

export const TOGGLE_ROUTE_SCENE_ACTIVITY = "TOGGLE_ROUTE_SCENE_ACTIVITY";
export const toggleRouteScene            = () => ({type: TOGGLE_ROUTE_SCENE_ACTIVITY});

