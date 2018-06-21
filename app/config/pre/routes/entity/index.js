import {Route}                from "../route";
import {HTTP, RENDER_METHODS} from "../constants";
import event                  from "../../entities/event/routes";
import user                   from "../../entities/user/routes";

const entity = {
	all: [
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
	user,
	event
};
export default [...entity.all, ...entity.user, ...entity.event,];