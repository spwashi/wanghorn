import {APP_BASE_URL_PATH} from "../../config";
import {normalizeRoutes, Route} from "./route";

const HTTP__GET  = 'get';
const HTTP__POST = 'post';

//
const smID_regex = `[\\[a-zA-Z\\]\\s]+`;

//
const homeRoutes    = [
    new Route({
                  renderedBy: "client",
                  pattern:    "$",
                  name:       "home",
                  title:      "Home"
              }),
    new Route({
                  resolution: "#[Home]::test",
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
                  resolution: "#[Home]::gallery",
                  pattern:    "gallery/items.json$"
              }),
];
const devRoutes     = [
    new Route({
                  name:       "dev--home",
                  title:      "Dev",
                  renderedBy: "client",
                  pattern:    "dev$"
              }),
    new Route({
                  resolution: "#[Dev]::monitors",
                  pattern:    "dev/monitors.json$",
                  name:       "dev--monitors"
              }),
    new Route({
                  resolution: "#[Dev]::models",
                  pattern:    "dev/models.json$",
                  name:       "dev--models"
              }),
    new Route({
                  resolution: "#[Dev]::entities",
                  pattern:    "dev/entities.json$",
                  name:       "dev--entities"
              }),
    new Route({
                  resolution: "#[Dev]::routes",
                  pattern:    "dev/routes.json$",
                  name:       "dev--routes"
              }),
    new Route({
                  resolution: "#[Dev]::executeQuery",
                  pattern:    `dev/models/{smID}:${smID_regex}/execute/{query}:[a-zA-Z_]+`,
                  name:       "dev--execute_query"
              }),
    new Route({
                  renderedBy: 'client',
                  pattern:    `dev/models/{smID}:${smID_regex}$`,
                  name:       "dev--model"
              }),
    new Route({
                  http_method: HTTP__GET,
                  resolution:  "#[Dev]::getSchematic",
                  pattern:     `dev/models/{smID}:${smID_regex}/schematic$`,
                  name:        "dev--get_model_schematic"
              }),
    new Route({
                  http_method: HTTP__GET,
                  resolution:  "#[Dev]::findAll",
                  pattern:     `dev/models/{smID}:${smID_regex}/all`,
                  name:        "dev--all_models"
              }),
    new Route({
                  renderedBy: 'client',
                  pattern:    `dev/models$`,
                  name:       'dev--model--home'
              }),
    new Route({
                  renderedBy: 'client',
                  pattern:    `dev/models/{smID}:${smID_regex}/create$`,
                  name:       'dev--create_model'
              }),
    new Route({
                  resolution:  "#[Dev]::createModel",
                  pattern:     `dev/models/{smID}:${smID_regex}/create/receive$`,
                  http_method: HTTP__POST,
                  name:        'dev--create_model--receive'
              }),
    
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
export const routes = normalizeRoutes(
    {
        frontend_renderer: '#[Home]::index',
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
            
            // User Routes
            new Route({
                          name:       "user--login",
                          resolution: "[User]@login",
                          pattern:    "user/login$"
                      }),
            new Route({
                          name:       "user--profile__json",
                          resolution: "[User]@userByID",
                          pattern:    "user/{id}:[a-zA-Z@\.]+$"
                      }),
            new Route({
                          resolution: "[User]@signUp",
                          pattern:    "user/signup/receive",
                          name:       "user--process_signup"
                      }),
        ]
    }
);