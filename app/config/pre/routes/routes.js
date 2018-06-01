import {APP_BASE_URL_PATH} from "../../config";
import {normalizeRoutes, Route} from "./route";

const HTTP__GET  = 'get';
const HTTP__POST = 'post';

//
const smID_regex = `[\\[_a-zA-Z\\]\\s]+`;

//
const homeRoutes = [
    new Route({
                  renderedBy: "client",
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
                  renderedBy: "client",
                  pattern:    'about-me$',
                  name:       'about_me',
                  title:      "About Me"
              }),
    new Route({
                  renderedBy: "client",
                  pattern:    'gallery$',
                  name:       'gallery--home',
                  title:      "Gallery"
              }),
    new Route({
                  renderedBy: "client",
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
                  renderedBy: "client",
                  pattern:    'events$',
                  name:       'events--home',
                  title:      "Events"
              }),
    new Route({
                  renderedBy: "client",
                  pattern:    'events/{id}:.+/view',
                  name:       'events--item__view',
                  title:      "Event View"
              }),
];

// DEV ROUTES
const dev           = {
    models:   [
        new Route({
                      renderedBy: 'client',
                      pattern:    `dev/models/{name}:[a-zA-Z_]+$`,
                      name:       "dev--model"
                  }),
        new Route({
                      name:       "dev--models",
                      title:      "Models",
                      renderedBy: "client",
                      pattern:    "dev/models$"
                  }),
        new Route({
                      resolution: "[Dev]@models",
                      pattern:    "dev/models.json$",
                      name:       "dev--models__json"
                  }),
        new Route({
                      name:       "dev--model--property",
                      title:      "Model Property",
                      pattern:    "dev/models/{owner}:[a-zA-Z_]+/property/{property}:[a-zA-Z_]+$",
                      renderedBy: "client"
                  }),
        new Route({
                      http_method: HTTP__GET,
                      resolution:  "[Dev]@findAll",
                      pattern:     `dev/models/{name}:[a-zA-Z_]+/all`,
                      name:        "dev--all_models"
                  }),
        new Route({
                      http_method: HTTP__GET,
                      resolution:  "[Dev]@getSchematic",
                      pattern:     `dev/models/{name}:[a-zA-Z_]+/schematic$`,
                      name:        "dev--get_model_schematic"
                  }),
        new Route({
                      renderedBy: 'client',
                      pattern:    `dev/models$`,
                      name:       'dev--model--home'
                  }),
        new Route({
                      renderedBy: 'client',
                      pattern:    `dev/models/{name}:[a-zA-Z_]+/create$`,
                      name:       'dev--create_model'
                  }),
        new Route({
                      resolution:  "[Dev]@createModel",
                      pattern:     `dev/models/{name}:[a-zA-Z_]+/create/receive$`,
                      http_method: HTTP__POST,
                      name:        'dev--create_model--receive'
                  })
    ],
    entities: [
        new Route({
                      name:       "dev--entities",
                      title:      "Entities",
                      renderedBy: "client",
                      pattern:    "dev/entities$"
                  }),
        new Route({
                      renderedBy: 'client',
                      pattern:    `dev/entities/{name}:[a-zA-Z_]+$`,
                      name:       "dev--entity"
                  }),
        new Route({
                      name:       "dev--entity--property",
                      title:      "Entity Property",
                      pattern:    "dev/entities/{owner}:[a-zA-Z_]+/property/{property}:[a-zA-Z_]+$",
                      renderedBy: "client"
                  }),
        new Route({
            
                      resolution: "[Dev]@entities",
                      pattern:    "dev/entities.json$",
                      name:       "dev--entities__json"
                  }),
        new Route({
                      renderedBy: 'client',
                      pattern:    "dev/entities/{name}:[a-zA-Z]+/create$",
                      name:       "dev--create_entity"
                  }),
        new Route({
                      resolution:  "[Dev]@createEntity",
                      pattern:     `dev/entities/{name}:[a-zA-Z_]+/create/receive$`,
                      http_method: HTTP__POST,
                      name:        'dev--create_entity--receive'
                  })
    ]
};
const devRoutes     = [
    new Route({
                  name:       "dev--home",
                  title:      "Dev",
                  renderedBy: "client",
                  pattern:    "dev$"
              }),
    // models
    ...dev.models,
    // entities
    ...dev.entities,
    // routes
    new Route({
                  resolution: "[Dev]@monitors",
                  pattern:    "dev/monitors.json$",
                  name:       "dev--monitors__json"
              }),
    
    // TRU dev
    new Route({
                  resolution: "[Dev]@status",
                  pattern:    "dev/status.json$",
                  name:       "dev--status__json"
              }),
    new Route({
                  resolution: "[Dev]@routes",
                  pattern:    "dev/routes.json$",
                  name:       "dev--routes__json"
              }),
    new Route({
                  renderedBy: 'client',
                  title:      'Routes',
                  pattern:    "dev/routes$",
                  name:       "dev--routes"
              }),
    new Route({
                  resolution: "[Dev]@executeQuery",
                  pattern:    `dev/models/{smID}:${smID_regex}/execute/{query}:[a-zA-Z_]+`,
                  name:       "dev--execute_query"
              }),
    
    //
    new Route({
                  resolution: "[Email]@test",
                  pattern:    "dev/email/test$"
              }),
    new Route({
                  resolution: "[Email]@tmp",
                  pattern:    "dev/email/boon$"
              }),
    new Route({
                  resolution: "[Email]@completeTest",
                  pattern:    "dev/email/test/{signup_nonce}",
                  name:       'user--signup_continue'
              }),
];
const entity        = {
    all:  [
        new Route({
                      title:      'Create Entity',
                      renderedBy: 'client',
                      pattern:    "entity/{name}:[a-zA-Z_]+/create$",
                      name:       "entity--create"
                  }),
        new Route({
                      resolution:  "[Entity]@create",
                      pattern:     "entity/{name}:[a-zA-Z_]+/create/receive$",
                      name:        "entity--create--receive",
                      http_method: HTTP__POST
                  }),
    ],
    user: [
        new Route({
                      name:       "user--process_login",
                      resolution: "[User]@login",
                      pattern:    "user/login$"
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
const entityRoutes  = [...entity.all, ...entity.user];
const model         = {
    all: [
        new Route({
                      title:      'Create Model',
                      renderedBy: 'client',
                      pattern:    "model/{name}:[a-zA-Z_]+/create$",
                      name:       "model--create"
                  }),
        new Route({
                      resolution:  "[Model]@create",
                      pattern:     "model/{name}:[a-zA-Z_]+/create/receive$",
                      name:        "model--create--receive",
                      http_method: HTTP__POST
                  }),
    ],
};
const modelRoutes   = [...model.all];
export const routes = normalizeRoutes(
    {
        frontend_renderer: '[Home]@index',
        pattern_prefix:    APP_BASE_URL_PATH && APP_BASE_URL_PATH.length ? `${APP_BASE_URL_PATH}/` : '',
        routes:            [
            // Error Handlers
            new Route({
                          resolution: "[Error]@rt_404",
                          pattern:    "404/{path}",
                          name:       "error-404"
                      }),
            
            // Home Routes
            ...homeRoutes,
            // Dev Routes (remove from production!)
            ...devRoutes,
            ...entityRoutes,
            ...modelRoutes,
            new Route({
                          name:       "file--prime_upload",
                          resolution: "[File]@prime",
                          pattern:    "file/upload"
                      }),
        ]
    }
);