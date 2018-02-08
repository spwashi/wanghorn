import path from "path";

//

export const APP_DOMAIN    = 'http://localhost';
export const APP_PATH      = `wanghorn`;
export const APP_NAME      = `wanghorn`;
export const APP_NAMESPACE = APP_NAME.toUpperCase();
export const APP_URL       = `${APP_DOMAIN}/${APP_PATH}/`;

// standard

export const APP_APPLICATION_DIR = path.resolve(__dirname, '..');
export const APP_PUBLIC_DIR      = path.resolve(APP_APPLICATION_DIR, '..', 'public');
export const APP_VIEW_DIR        = path.resolve(APP_APPLICATION_DIR, 'view');

