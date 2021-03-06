import * as config from "../../../config/out/public.json";

export const {routes}      = config;
export const getCleanPath  =
	             path => {
		             let validators = {};
		             path           = path.split('/')
		                                  .map(pathPart => {
			                                  let variable = /{([a-zA-Z0-9_]+)}:*(.*)/.exec(pathPart);
			                                  if (variable && variable[1]) {
				                                  validators[variable[1]] = variable[2];
				                                  return `{${variable[1]}}`;
			                                  }
			                                  return pathPart;
		                                  })
		                                  .join('/');
		             return {path, validators};
	             };
export const addArgsToPath =
	             (path, args = {}, validators, skipIfEmpty) => {
		             let location = path;
		             if (path[path.length - 1] === '$') {
			             location = path.substr(0, path.length - 1);
		             }

		             Object.entries(validators).forEach(([arg_name]) => {
			             if (skipIfEmpty) return;
			             if (!(arg_name in args)) throw new Error("Missing argument " + arg_name);
		             });

		             for (const variable in args) {
			             if (!args.hasOwnProperty(variable)) continue;

			             let val = args[variable] || '';
			             if (!(val = val.trim()).length) {
				             if (skipIfEmpty) val = `{${variable}}`;
				             else {
					             throw new Error("Missing value for " + variable);
				             }
			             }
			             location = location.replace(`{${variable}}`, val);
		             }
		             return location;
	             };
export const getURI        =
	             function (name, routeArguments = {}, {fallback, skipEmpty, root, asReactRoute, doThrow = true} = {}) {
		             let pattern = (routes[name] || {}).pattern;
		             if (!pattern) {
			             if (fallback) {
				             return getURI(fallback, routeArguments, {skipEmpty, asReactRoute, doThrow})
			             }

			             if (doThrow) {
				             throw new Error(`Could not find ${name}`);
			             }else{
			             	return null;
			             }
		             }

		             let {path, validators} = getCleanPath(pattern);
		             path                   = addArgsToPath(path, routeArguments, validators, skipEmpty);
		             if (asReactRoute) {
			             path = path.replace(/{([a-zA-Z0-9]+)}/g, ':$1');
		             }
		             // We could set the base path to anything if necessary
		             path = `${root !== false ? (root || '') + '/' : ''}${path}`;
		             return path;
	             };
export const getReactPath  = (name, routeArguments, {fallback} = {}) => getURI(name, routeArguments, {fallback, asReactRoute: true, skipEmpty: true});
export const getTitle      = name => {
	let route = routes[name];
	if (!route) return false;
	return route.title || false;
}