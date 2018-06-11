import {ACTIVE_USER_FOUND} from "./actions";

export default [logUserInMiddleware];


function logUserInMiddleware(store) {
    return next => action => {
        next(action);
        const state = store.getState();
        const dispatch = store.dispatch;
        switch (action.type) {
            case ACTIVE_USER_FOUND:
                console.log(action);
                break;
        }
    };
}
