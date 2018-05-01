import {getURI} from "./resolution";

export const stdPathOptions      = {root: ``};
// Standard paths do not need a "root" url
export const HOME                = getURI("home");
export const ABOUT_ME            = getURI("about_me");
export const DEV                 = getURI("dev--home");
export const USER_LOGIN_PATH     = getURI("user--login");
export const GALLERY             = getURI("gallery--home");
export const GALLERY_ITEMS       = getURI("gallery--items");
export const USER_SIGNUP_PROCESS = getURI("user--process_signup");
