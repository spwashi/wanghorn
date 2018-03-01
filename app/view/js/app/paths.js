import * as config from "../../../config/out/public.json";

export const HOME            = `${config.appPath && config.appPath.length ? '/' + config.appPath : ''}`;
export const ABOUT           = `${HOME}/about`;
export const TOPICS          = `${HOME}/topics`;
export const USER_LOGIN_PATH = `${HOME}/user/login`;