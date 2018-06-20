import {Route}          from "../route";
import {RENDER_METHODS} from "../constants";
export default [
	new Route({
		          renderedBy: RENDER_METHODS.client,
		          pattern:    'events$',
		          name:       'event--home',
		          title:      "Events"
	          }),
	new Route({
		          renderedBy: RENDER_METHODS.client,
		          pattern:    'event$',
		          name:       'event--home--fallback',
		          title:      "Events"
	          }),
	new Route({
		          resolution: '[Event]@create',
		          pattern:    'event/create/receive',
		          name:       'entity--event--create--receive',
		          title:      "Receive Event Creation"
	          }),
	new Route({
		          renderedBy: RENDER_METHODS.client,
		          pattern:    'event/new$',
		          name:       'event--create',
		          title:      "Add Event"
	          }),
	new Route({
		          renderedBy: RENDER_METHODS.client,
		          pattern:    'event/{id}:[a-zA-Z_\\-\\d]+/edit$',
		          name:       'event--edit',
		          title:      "Edit Event"
	          }),
	new Route({
		          resolution: '[Event]@findEvent',
		          pattern:    'event/{name}:[a-zA-Z_\\-\\d]+',
		          name:       'event--find',
	          }),
	new Route({
		          resolution: "[Event]@all",
		          pattern:    'event/all$',
		          name:       'event--all',
		          title:      "All Events"
	          }),
	new Route({
		          renderedBy: RENDER_METHODS.client,
		          pattern:    'event/{name}:[a-zA-Z_\\-\\d]+/view',
		          name:       'event--item__view',
		          title:      "Event View"
	          })
]