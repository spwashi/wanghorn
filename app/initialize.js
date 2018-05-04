import {models} from "./config/pre/models";
import {entities} from "./config/pre/entities";
import defaultConnection from "./config/pre/connection";
import {routes} from "./config/pre/routes/routes"
import {APP_BASE_URL_PATH, APP_NAME, APP_NAMESPACE, APP_PATH__APP_DIR, APP_PATH__CONFIG_DIR, APP_PATH__PUBLIC_DIR, APP_ROOT_URL, APP_URL__PUBLIC, ENVIRONMENT} from "./config/config";
import fs from "fs";
import replace from "replace-in-file";
import {Sm} from "spwashi-sm"
import {Route} from "./config/pre/routes/route";

// Requires appPath to be set. Assumes the configPath is either passed in or derived from the appPath
let [, , appPath, configPath__ARG] = process.argv;
appPath                            = appPath || __dirname;
const configPath                   = configPath__ARG || `${appPath}/config`;

const ApplicationConfiguration = Sm.ApplicationConfiguration;
const Application              = Sm.Application;

const appConfigured = configureApplication({
                                               name:        APP_NAME,
                                               namespace:   APP_NAMESPACE,
                                               environment: ENVIRONMENT,
    
                                               models,
                                               entities,
                                               routes,
    
                                               rootUrl:     APP_ROOT_URL,
                                               baseUrlPath: APP_BASE_URL_PATH,
    
                                               urls:  {
                                                   public: APP_URL__PUBLIC
                                               },
                                               paths: {
                                                   app:    APP_PATH__APP_DIR,
                                                   public: APP_PATH__PUBLIC_DIR,
                                                   config: APP_PATH__CONFIG_DIR,
                                               }
                                           });
appConfigured.then(createConfigOutput)
             .then((app: Application) => replaceAppBoilerplateConstants(app))
             .catch(e => console.log(e));

function configureApplication(appConfig: appConfig): Application {
    let applicationConfiguration = new ApplicationConfiguration(appConfig);
    let cancel                   = false;
    let saveEventsAndDie         = new Promise((resolve, reject) => {
        return setTimeout(i => {
            !cancel && saveAppConfigEvents();
            return reject("Could not configure Application");
        }, 1000);
    });
    return Promise.race([
                            saveEventsAndDie,
                            applicationConfiguration.configure(new Application)
                                                    .then(saveAppConfigEvents)
                                                    .then(i => ((cancel = true), i))
                        ]);
    
    function saveAppConfigEvents(app: Application) {
        saveJSON(applicationConfiguration.eventManager.emittedEventNames, 'emitted');
        return app;
    }
    
}

// Generate config files used by SmPHP
function createConfigOutput(app: Application) {
    const appAsJson                             = {env: ENVIRONMENT || 'production', ...app.toJSON()};
    const configPublic                          = app.toJSON__public() || {};
    const {models, entities, routes, ...config} = appAsJson;
    
    Object.entries(routes.routes)
          .forEach(entry => {
              let route: Route = entry[1];
              if (route.name && route.pattern) {
                  configPublic.routes             = configPublic.routes || {};
                  configPublic.routes[route.name] = {
                      pattern:     route.pattern,
                      http_method: route.http_method,
                      title:       route.title
                  }
              }
          });
    
    saveJSON(config, 'config');
    saveJSON({std: normalizeConnection(defaultConnection)}, 'connect');
    saveJSON(configPublic, 'public');
    saveJSON(models, 'models');
    saveJSON(entities, 'entities');
    saveJSON(routes, 'routes');
    
    return app;
}

//Save the configuration of an object to a .json file named filename.json
function saveJSON(configuredItem: {}, filename: string) {
    const jsonModels   = JSON.stringify(configuredItem, ' ', 3);
    const entitiesPath = `${configPath}/out/${filename}.json`;
    fs.writeFile(entitiesPath,
                 jsonModels,
                 err => {
                     if (err) return console.log(err);
                     console.log("The file was saved to " + entitiesPath);
                 });
}

//String replace on standard app properties
function replaceAppBoilerplateConstants(app) {
    if (!app.namespace) return;
    let srcPath    = app.paths.src || `${appPath}/src`;
    let configPath = app.paths.config || `${appPath}/config`;
    const options  = {
        files: [`${srcPath}/**/*`, configPath + '/config.php'],
        from:  new RegExp('WANGHORN', 'g'),
        to:    app.namespace,
    };
    return replace(options)
        .then(changes => console.log('Replaced the default namespace in :\n\t', changes.join(',\n\t')))
        .catch(error => console.error('Error occurred:', error));
}

function normalizeConnection(connection) {
    let {username, password, host, database} = connection;
    return {username, password, host, database};
}

type appConfig = { models: {}, routes: {}, name: string, namespace: string, domain: string, urlPath: string };