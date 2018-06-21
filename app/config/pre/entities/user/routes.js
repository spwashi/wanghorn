import {Route} from "../../routes/route";
export default [
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
];