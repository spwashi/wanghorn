import axios from "axios";
import {USER_LOGIN_PATH} from "../../../path/paths";

export const ACTIVE_USER_FOUND      = "ACTIVE_USER_FOUND";
export const ATTEMPT_LOGIN_RECEIVED = "ATTEMPT_LOGIN_RECEIVED";
export const attemptLoginBegin      = ({username, password}) => ({type: "ATTEMPT_LOGIN_BEGIN", username, password});
export const attemptLoginCompleted  = ({user, success}) => ({type: ATTEMPT_LOGIN_RECEIVED, user, success});
export const activeUserFound        = user => ({type: ACTIVE_USER_FOUND, user});
export const attemptLogin           = ({username, password}) =>
    dispatch => {
        dispatch(attemptLoginBegin({username, password}));
        
        return axios.post(USER_LOGIN_PATH, {username, password})
                    .then(response => {
                        let user_login_data = response && response.data && response.data;
                        dispatch(attemptLoginCompleted(user_login_data));
                        if (user_login_data && user_login_data.user) {
                            dispatch(activeUserFound(user_login_data.user));
                        }
                    });
    };
