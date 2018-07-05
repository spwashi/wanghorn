import path                                                                       from "path";
import {__CONFIGURATION__}                                                        from "../../config/config";

const IS_PROD = __CONFIGURATION__.ENVIRONMENT === 'production';


export const publicURL__HTML              = `${__CONFIGURATION__.URL_PATHS.APPLICATION}/public/html`;
export const publicURL__vendor            = `${__CONFIGURATION__.URL_PATHS.APPLICATION}/public/vendor`;
export const publicURL__IMG               = `${__CONFIGURATION__.URL_PATHS.APPLICATION}/public/img`;
export const publicURL__CSS               = `${__CONFIGURATION__.URL_PATHS.APPLICATION}/public/css`;
export const publicURL__JS                = `${__CONFIGURATION__.URL_PATHS.APPLICATION}/public/js`;
export const indexHTML_name               = `${__CONFIGURATION__.APP_NAME}.html`;
export const relativeHTML_output_filename = `../html/${indexHTML_name}`;
export const htmlTemplatePath             = path.resolve(__dirname, '../../view/html/react.ejs');
export const relativeCSS_output_filename  = `../css/style${IS_PROD ? '-[hash:6]' : ''}.css`;
export const outputPath                   = `${__CONFIGURATION__.DIR_PATHS.PUBLIC}`;
export const outputPath__JS               = path.resolve(outputPath, 'js');
export const outputPath__HTML             = path.resolve(outputPath, 'html');
export const outputPath__CSS              = path.resolve(outputPath, 'css');
export const inputPath__CSS               = path.resolve(__CONFIGURATION__.DIR_PATHS.VIEW, 'stylesheets', 'scss');
export const inputPath__config            = path.resolve(__CONFIGURATION__.DIR_PATHS.CONFIG, 'pre');
export const outputJS_Filename            = `${__CONFIGURATION__.APP_NAME}-[hash:6].js`;