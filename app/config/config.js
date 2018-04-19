import path from "path";

// ASSUMED TO CHANGE

// The domain name of the site we are configuring
export const APP_ROOT_URL      = 'http://localhost';
// The URL Path (sans leading or trailing slash) at which the main site can be found relative to the domain
export const APP_BASE_URL_PATH = `wanghorn`;
// The name of the application without spaces. Case sensitive, I recommend lowercase-with-dashes or camelCased
export const APP_NAME          = `wanghorn`;
// The namespace used in PHP to prefix app-specific files
export const APP_NAMESPACE     = APP_NAME.toUpperCase();
// The URL including the Path that we will use to access our files
export const APP_URL           = `${APP_ROOT_URL}/${APP_BASE_URL_PATH}`;
// URL for the public files (where we access the files output by webpack)
export const APP_URL__PUBLIC   = `${APP_URL}/public`;
// The environment in which we are operating -- defaults to production for the sake of probable intention
export const ENVIRONMENT       = process.env.NODE_ENV || 'production';

// Path to the app dir
export const APP_PATH__APP_DIR    = path.resolve(__dirname, '..');
// Path to the public/ dir (where our generated HTML, CSS, and JS will go in their respective folders)
export const APP_PATH__CONFIG_DIR = path.resolve(APP_PATH__APP_DIR, 'config');
export const APP_PATH__PUBLIC_DIR = path.resolve(APP_PATH__APP_DIR, '..', 'public');
// Path the the app/view/ dir (where we have our templates)
export const APP_PATH__VIEW_DIR   = path.resolve(APP_PATH__APP_DIR, 'view');

