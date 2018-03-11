import * as config from "../../../../config/out/public.json";

export const HOME = `${config.appPath ? '/' + config.appPath : ''}`;

export const PUBLIC         = `${HOME}/public`;
export const PUBLIC__IMAGES = `${PUBLIC}/img`;
export const PUBLIC__CSS    = `${PUBLIC}/css`;
export const PUBLIC__JS     = `${PUBLIC}/js`;

export const LINK_ONE = `${HOME}/one`;
export const LINK_TWO = `${HOME}/two`;