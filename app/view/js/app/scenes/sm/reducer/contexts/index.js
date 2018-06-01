// Contexts contain the schematics of smEntities that exist within them
import {CONTEXT_RESOLVED} from "../../actions/index";

export default (state, action) => {
    switch (action.type) {
        case CONTEXT_RESOLVED:
            let context = action.context;
            
            if (!context) {
                console.error("malformed context", context);
                return state;
            }
            
            let name = context.name;
            return {...state, [name]: context};
        
        default:
            return state || {};
    }
};