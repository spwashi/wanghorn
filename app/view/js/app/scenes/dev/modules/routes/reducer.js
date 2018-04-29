import {FETCH_ROUTES_RECEIVED} from "./actions";

export default (state, action) => {
    let routes;
    switch (action.type) {
        case FETCH_ROUTES_RECEIVED:
            routes = action.routes;
            console.log(routes);
            return routes;
        default:
            return state || {routes: {}};
    }
}