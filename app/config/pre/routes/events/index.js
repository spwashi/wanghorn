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
		          resolution: '[Event]@create',
		          pattern:    'events/create/receive',
		          name:       'entity--event--create--receive',
		          title:      "Receive Event Creation"
	          }),
	new Route({
		          renderedBy: RENDER_METHODS.client,
		          pattern:    'events/new$',
		          name:       'event--create',
		          title:      "Add Event"
	          }),
	new Route({
		          resolution: '[Event]@findEvent',
		          pattern:    'event/{name}:[a-zA-Z_\\-\\d]+',
		          name:       'event--find',
	          }),
	new Route({
		          resolution: "[Event]@all",
		          pattern:    'events/all$',
		          name:       'events--all',
		          title:      "All Events"
	          }),
	new Route({
		          renderedBy: RENDER_METHODS.client,
		          pattern:    'events/{name}:[a-zA-Z_\\-\\d]+/view',
		          name:       'events--item__view',
		          title:      "Event View"
	          })
]