import {__CONFIGURATION__}      from "../../config";
import {normalizeRoutes, Route} from "./route";

import devRoutes    from './dev';
import errorRoutes  from './error';
import entityRoutes from './entity';
import homeRoutes   from './home';
import modelRoutes  from './model';
import fileRoutes   from './file';

const routes = [
	...devRoutes,

	...errorRoutes,

	...homeRoutes,

	...entityRoutes,
	...modelRoutes,
	...fileRoutes,

	new Route({
		          name:       "test_email",
		          resolution: "[Email]@test",
		          pattern:    "email/test$"
	          })
];
const config = {
	frontend_renderer: '[Home]@index',
	pattern_prefix:    __CONFIGURATION__.URL_PATHS.BASE_PATH && __CONFIGURATION__.URL_PATHS.BASE_PATH.length ? `${__CONFIGURATION__.URL_PATHS.BASE_PATH}/` : '',
	routes
};

export default normalizeRoutes(config);