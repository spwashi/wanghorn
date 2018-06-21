import {APP_BASE_URL_PATH}      from "../../config";
import {normalizeRoutes, Route} from "./route";

import devRoutes    from './dev';
import errorRoutes  from './error';
import entityRoutes from './entity';
import homeRoutes   from './home';
import eventRoutes  from '../entities/event/routes';
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
	pattern_prefix:    APP_BASE_URL_PATH && APP_BASE_URL_PATH.length ? `${APP_BASE_URL_PATH}/` : '',
	routes
};

export default normalizeRoutes(config);