import {Route} from "../route";
import {HTTP, RENDER_METHODS, smID_regex} from "../constants";

const dev = {
    models:   [
        new Route({
                      renderedBy: RENDER_METHODS.client,
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
                      resolution: "Dev\\[Model]@metas",
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
                      http_method: HTTP.GET,
                      resolution:  "[Dev]@findAll",
                      pattern:     `dev/models/{name}:[a-zA-Z_]+/all`,
                      name:        "dev--all_models"
                  }),
        new Route({
                      http_method: HTTP.GET,
                      resolution:  "[Dev]@getSchematic",
                      pattern:     `dev/models/{name}:[a-zA-Z_]+/schematic$`,
                      name:        "dev--get_model_schematic"
                  }),
        new Route({
                      renderedBy: RENDER_METHODS.client,
                      pattern:    `dev/models$`,
                      name:       'dev--model--home'
                  }),
        new Route({
                      renderedBy: RENDER_METHODS.client,
                      pattern:    `dev/models/{name}:[a-zA-Z_]+/create$`,
                      name:       'dev--create_model'
                  }),
        new Route({
                      resolution:  "[Dev]@createModel",
                      pattern:     `dev/models/{name}:[a-zA-Z_]+/create/receive$`,
                      http_method: HTTP.POST,
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
                      renderedBy: RENDER_METHODS.client,
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
                      renderedBy: RENDER_METHODS.client,
                      pattern:    "dev/entities/{name}:[a-zA-Z]+/create$",
                      name:       "dev--create_entity"
                  }),
        new Route({
                      resolution:  "[Dev]@createEntity",
                      pattern:     `dev/entities/{name}:[a-zA-Z_]+/create/receive$`,
                      http_method: HTTP.POST,
                      name:        'dev--create_entity--receive'
                  })
    ]
};
export default [
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
                  renderedBy: RENDER_METHODS.client,
                  title:      'Routes',
                  pattern:    "dev/routes$",
                  name:       "dev--routes"
              }),
    new Route({
                  resolution: "[Dev]@executeQuery",
                  pattern:    `dev/models/{smID}:${smID_regex}/execute/{query}:[a-zA-Z_]+`,
                  name:       "dev--execute_query"
              }),
    new Route({
                  resolution: "[Dev]@setup",
                  pattern:    `dev/setup_all`,
                  name:       "dev--setup"
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