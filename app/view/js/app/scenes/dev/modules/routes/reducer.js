import {FETCH_ROUTES_RECEIVED, TOGGLE_ROUTE_SCENE_ACTIVITY} from "./actions";

export default (state, action) => {
    let routes;
    switch (action.type) {
        case TOGGLE_ROUTE_SCENE_ACTIVITY:
            return {...state, isActive: !state.isActive};
        case FETCH_ROUTES_RECEIVED:
            routes = action.routes;
            return {...state, routes};
        default:
            return state || {routes: {}, isActive: false};
    }
}