import * as config from "../../config/out/public.json";

export const INDEX          = `${config.appPath ? '/' + config.appPath : ''}`;
export const ABSOLUTE_INDEX = `${config.appUrl}`;
export const HOME           = INDEX;

export const USER_SIGNUP   = `${INDEX}/user/signup/receive`;
export const DEV           = `${INDEX}/dev`;
export const GALLERY       = `${INDEX}/gallery`;
export const GALLERY_ITEMS = `${INDEX}/gallery/items.json`;

export const PUBLIC          = `${ABSOLUTE_INDEX}/public`;
export const PUBLIC__IMAGES  = `${PUBLIC}/img`;
export const PUBLIC__CSS     = `${PUBLIC}/css`;
export const PUBLIC__JS      = `${PUBLIC}/js`;
export const USER_LOGIN_PATH = `${HOME}/user/login`;

export const ABOUT_ME = `${HOME}/about_me`;