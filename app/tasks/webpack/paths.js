import path                                                                                                                from "path";
import {APP_NAME, APP_PATH__CONFIG_DIR, APP_PATH__PUBLIC_DIR, APP_PATH__VIEW_DIR, APP_URL as DEFAULT_APP_URL, ENVIRONMENT} from "../../config/config";

const IS_PROD           = ENVIRONMENT === 'production';
const TRYNA_USE_WEBPACK = false;

const APP_URL = IS_PROD || !TRYNA_USE_WEBPACK ? DEFAULT_APP_URL : 'http://localhost:8080';

export const publicURL__HTML              = `${APP_URL}/public/html`;
export const publicURL__vendor            = `${APP_URL}/public/vendor`;
export const publicURL__IMG               = `${APP_URL}/public/img`;
export const publicURL__CSS               = `${APP_URL}/public/css`;
export const publicURL__JS                = `${APP_URL}/public/js`;
export const indexHTML_name               = `${APP_NAME}.html`;
export const relativeHTML_output_filename = `../html/${indexHTML_name}`;
export const htmlTemplatePath             = path.resolve(__dirname, '../../view/html/react.ejs');
export const relativeCSS_output_filename  = `../css/style${IS_PROD ? '-[hash:6]' : ''}.css`;
export const outputPath                   = `${APP_PATH__PUBLIC_DIR}`;
export const outputPath__JS               = path.resolve(outputPath, 'js');
export const outputPath__HTML             = path.resolve(outputPath, 'html');
export const outputPath__CSS              = path.resolve(outputPath, 'css');
export const inputPath__CSS               = path.resolve(APP_PATH__VIEW_DIR, 'stylesheets', 'scss');
export const inputPath__config            = path.resolve(APP_PATH__CONFIG_DIR, 'pre');
export const outputJS_Filename            = `${APP_NAME}-[hash:6].js`;