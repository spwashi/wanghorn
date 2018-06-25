import {Route}          from "../../routes/route";
import {RENDER_METHODS} from "../../routes/constants";
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
		          resolution: '[Event]@edit',
		          pattern:    'event/edit/receive',
		          name:       'entity--event--edit--receive',
		          title:      "Receive Event Edit Request"
	          }),
	new Route({
		          name:       'event--create',
		          renderedBy: RENDER_METHODS.client,
		          pattern:    'event/new$',
		          title:      "Add Event"
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
	          }),
	new Route({
		          name:       'event--edit',
		          renderedBy: RENDER_METHODS.client,
		          pattern:    'event/{id}:[a-zA-Z_\\-\\d]+/edit$',
		          title:      "Edit Event"
	          }),
	new Route({
		          resolution: '[Event]@findEvent',
		          pattern:    'event/{name}:[a-zA-Z_\\-\\d]+',
		          name:       'event--find',
	          })
]