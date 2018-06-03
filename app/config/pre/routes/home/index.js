import {Route} from "../route";
import {RENDER_METHODS} from "../constants";

export default [
    new Route({
                  renderedBy: RENDER_METHODS.client,
                  pattern:    "$",
                  name:       "home",
                  title:      "Home"
              }),
    new Route({
                  resolution: "[Home]@test",
                  pattern:    null,
                  name:       'test'
              }),
    new Route({
                  renderedBy: RENDER_METHODS.client,
                  pattern:    'about-me$',
                  name:       'about_me',
                  title:      "About Me"
              }),
    new Route({
                  renderedBy: RENDER_METHODS.client,
                  pattern:    'gallery$',
                  name:       'gallery--home',
                  title:      "Gallery"
              }),
    new Route({
                  renderedBy: RENDER_METHODS.client,
                  pattern:    'gallery/{name}:[a-zA-Z]+',
                  name:       'gallery--item__view',
                  title:      "Gallery Item View"
              }),
    new Route({
                  name:       'gallery--items',
                  resolution: "[Home]@gallery",
                  pattern:    "gallery/items.json$"
              }),
    
    new Route({
                  renderedBy: RENDER_METHODS.client,
                  pattern:    'events$',
                  name:       'events--home',
                  title:      "Events"
              }),
    new Route({
                  renderedBy: RENDER_METHODS.client,
                  pattern:    'events/{id}:.+/view',
                  name:       'events--item__view',
                  title:      "Event View"
              }),
]