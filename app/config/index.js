import path from "path";

// ASSUMED TO CHANGE

// The domain name of the site we are configuring
export const APP_DOMAIN    = 'http://localhost';
// The URL Path (sans leading or trailing slash) at which the main site can be found relative to the domain
export const APP_PATH      = `wanghorn`;
// The name of the application without spaces. Case sensitive, I recommend lowercase-with-dashes or camelCased
export const APP_NAME      = `wanghorn`;
// The namespace used in PHP to prefix app-specific files
export const APP_NAMESPACE = APP_NAME.toUpperCase();
// The URL including the Path that we will use to access our files
export const APP_URL       = `${APP_DOMAIN}/${APP_PATH}`;


// STANDARDS


// Path to the app dir
export const APP_APPLICATION_DIR = path.resolve(__dirname, '..');
// Path to the public/ dir (where our generated HTML, CSS, and JS will go in their respective folders)
export const APP_PUBLIC_DIR      = path.resolve(APP_APPLICATION_DIR, '..', 'public');
// Path the the app/view/ dir (where we have our templates)
export const APP_VIEW_DIR        = path.resolve(APP_APPLICATION_DIR, 'view');

