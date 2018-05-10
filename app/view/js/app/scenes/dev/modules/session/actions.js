import axios from "axios";
import {USER_LOGIN_PATH} from "../../../../../path/paths";

export const ATTEMPT_LOGIN_RECEIVED = "ATTEMPT_LOGIN_RECEIVED";
export const attemptLoginBegin      = ({username, password}) => ({type: "ATTEMPT_LOGIN_BEGIN", username, password});
export const attemptLoginCompleted  = ({user, success}) => ({type: ATTEMPT_LOGIN_RECEIVED, user, success});
export const attemptLogin           = ({username, password}) =>
    dispatch => {
        dispatch(attemptLoginBegin({username, password}));
        
        return axios.post(USER_LOGIN_PATH, {username, password})
                    .then(response => dispatch(attemptLoginCompleted(response && response.data && response.data)));
    };
