import {Route}          from "../route";
import {RENDER_METHODS} from "../constants";
export default [
	new Route({
		          renderedBy: RENDER_METHODS.client,
		          pattern:    'events$',
		          name:       'events--home',
		          title:      "Events"
	          }),
	new Route({
		          renderedBy: RENDER_METHODS.client,
		          pattern:    'events/new$',
		          name:       'event--create',
		          title:      "Add Event"
	          }),
	new Route({
		          resolution: "[Home]@events",
		          pattern:    'events/all$',
		          name:       'events--all',
		          title:      "All Events"
	          }),
	new Route({
		          renderedBy: RENDER_METHODS.client,
		          pattern:    'events/{id}:.+/view',
		          name:       'events--item__view',
		          title:      "Event View"
	          })
]