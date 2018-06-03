import {APP_BASE_URL_PATH} from "../../config";
import {normalizeRoutes} from "./route";

import devRoutes from './dev';
import errorRoutes from './error';
import entityRoutes from './entity';
import homeRoutes from './home';
import modelRoutes from './model';
import fileRoutes from './file';

const routes = [
    ...devRoutes,
    
    ...errorRoutes,
    
    ...homeRoutes,
    
    ...entityRoutes,
    ...modelRoutes,
    ...fileRoutes,
];
const config = {
    frontend_renderer: '[Home]@index',
    pattern_prefix:    APP_BASE_URL_PATH && APP_BASE_URL_PATH.length ? `${APP_BASE_URL_PATH}/` : '',
    routes
};

export default normalizeRoutes(config);