import {Route}                from "../route";
import {HTTP, RENDER_METHODS} from "../constants";

const entity = {
	all:  [
		new Route({
			          title:      'Create Entity',
			          renderedBy: RENDER_METHODS.client,
			          pattern:    "entity/{name}:[a-zA-Z_]+/create$",
			          name:       "entity--create"
		          }),
		new Route({
			          resolution:  "[Entity]@create",
			          pattern:     "entity/{name}:[a-zA-Z_]+/create/receive$",
			          name:        "entity--create--receive",
			          http_method: HTTP.POST
		          }),
		new Route({
			          resolution:  "[Entity]@edit",
			          pattern:     "entity/{name}:[a-zA-Z_]+/edit/receive$",
			          name:        "entity--edit--receive",
			          http_method: HTTP.POST
		          }),
	],
	user: [
		new Route({
			          name:       "user--process_login",
			          resolution: "[User]@login",
			          pattern:    "user/login$"
		          }),
		new Route({
			          name:       'user--verify',
			          resolution: "[User]@verifyUser",
			          pattern:    "user/verify/{hash}:[a-zA-Z\\d]+$"
		          }),
		new Route({
			          name:       "user--logout$",
			          resolution: "[User]@logout",
			          pattern:    "user/logout$"
		          }),
		new Route({
			          resolution: "[User]@signUp",
			          pattern:    "user/signup/receive$",
			          name:       "user--process_signup"
		          }),
		new Route({
			          renderedBy: "client",
			          pattern:    "user/signup$",
			          name:       "user--signup"
		          }),
		new Route({
			          resolution: "[User]@signUp",
			          pattern:    "user/signup/receive$",
			          name:       "entity--user--create--receive"
		          }),
	]
};
export default [...entity.all, ...entity.user];