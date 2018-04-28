import {APP_BASE_URL_PATH} from "../../config";
import {Route} from "./route";

const HTTP__GET  = 'get';
const HTTP__POST = 'post';

//
const smID_regex = `[\\[a-zA-Z\\]\\s]+`;

//
const homeRoutes    = [
    new Route({
                  resolution: "#[Home]::index",
                  pattern:    "$",
                  name:       "home"
              }),
    new Route({
                  resolution: "#[Home]::test",
                  pattern:    null,
                  name:       'test'
              }),
];
const devRoutes     = [
    new Route({
                  resolution: "#[Dev]::monitors",
                  pattern:    "dev/monitors",
                  name:       "monitors"
              }),
    new Route({
                  resolution: "#[Dev]::models",
                  pattern:    "dev/models.json"
              }),
    new Route({
                  resolution: "#[Dev]::routes",
                  pattern:    "dev/routes.json"
              }),
    new Route({
                  resolution: "#[Dev]::executeQuery",
                  pattern:    `dev/model/{smID}:${smID_regex}/execute/{query}:[a-zA-Z_]+`
              }),
    new Route({
                  resolution: "#[Dev]::getSchematic",
                  pattern:    `dev/model/{smID}:${smID_regex}$`,
                  httpMethod: HTTP__GET,
                  name:       null
              }),
    new Route({
                  resolution: "#[Dev]::createModel",
                  pattern:    `dev/model/{smID}:${smID_regex}/create`,
                  httpMethod: HTTP__POST,
                  name:       null
              }),
    new Route({
                  resolution: "#[Dev]::eg",
                  pattern:    "dev/example",
                  name:       "example"
              }),
];
let emailRoutes     = [
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
                  name:       'user_signup_eg_email'
              }),];
export const routes = {
    pattern_prefix: APP_BASE_URL_PATH + '/',
    routes:         [
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
        
        // (site helpers)
        new Route({
                      resolution: "#[Home]::gallery",
                      pattern:    "gallery/items.json"
                  }),
        
        // User Routes
        new Route({
                      resolution: "[User]@login",
                      pattern:    "user/login$"
                  }),
        new Route({
                      resolution: "[User]@userByID",
                      pattern:    "user/{id}:[a-zA-Z@\.]+$"
                  }),
        new Route({
                      resolution: "[User]@signUp",
                      pattern:    "user/signup/receive"
                  }),
        
        // Email
        ...emailRoutes,
        
        // Catch-all
        new Route({
                      resolution: "#[Home]::index",
                      pattern:    ".*"
                  }),
    
    ]
};