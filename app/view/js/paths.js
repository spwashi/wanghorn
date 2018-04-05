import * as config from "../../config/out/public.json";

export const INDEX          = `${config.appPath ? '/' + config.appPath : ''}`;
export const ABSOLUTE_INDEX = `${config.appUrl}`;
export const HOME           = INDEX;

export const DEV = `${INDEX}/dev`;

export const PUBLIC          = `${ABSOLUTE_INDEX}/public`;
export const PUBLIC__IMAGES  = `${PUBLIC}/img`;
export const PUBLIC__CSS     = `${PUBLIC}/css`;
export const PUBLIC__JS      = `${PUBLIC}/js`;
export const USER_LOGIN_PATH = `${HOME}/user/login`;

export const LINK_ONE = `${HOME}/one`;
export const LINK_TWO = `${HOME}/two`;