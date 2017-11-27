import {CREATE_EVALUATION} from "./actionTypes";

export default (state, action) => {
    switch (action.type) {
        case CREATE_EVALUATION:
            console.log('here we are');
            return 'hello';
    }
}