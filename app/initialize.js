import models from "./config/pre/models";
import {routes} from "./config/pre/routes/routes"
import {APP_DOMAIN, APP_NAME, APP_NAMESPACE, APP_PATH, APP_URL} from "./config";
import fs from "fs";
import replace from "replace-in-file";
import {Sm} from "spwashi-sm"

const ApplicationConfiguration = Sm.ApplicationConfiguration;
const Application              = Sm.Application;

const config = {
    models,
    routes,
    namespace: APP_NAMESPACE,
    domain:    APP_DOMAIN,
    urlPath:   APP_PATH,
    name:      APP_NAME
};

let applicationConfigured = configureApplication(config);

applicationConfigured.then((app: Application) => {
                         let appConfig          = {
                             name:      app.name,
                             namespace: app.namespace,
                             url:       app.url
                         };
                         const jsFrontendConfig = {
                             name: app.name,
        
                             appDomain: APP_DOMAIN,
                             appUrl:    APP_URL,
                             appPath:   APP_PATH
        
                         };
    
                         saveJSON(appConfig, 'config');
                         saveJSON(jsFrontendConfig, 'public');
                         saveJSON(app.models, 'models');
                         saveJSON(app.routes, 'routes');
    
                         return app;
                     })
                     .then((app: Application) => replaceAppBoilerplateConstants(app))
                     .catch(e => console.log(e));

/**
 * Configure the Application using an object containing the config
 * @param appConfig
 * @return {Promise}
 */
function configureApplication(appConfig: { models: {}, routes: {}, name: string, namespace: string, domain: string, urlPath: string }): Application {
    let applicationConfiguration = new ApplicationConfiguration(appConfig);
    let saveAppConfigEvents      = function (app: Application) {
        saveJSON(applicationConfiguration.eventManager.emittedEventNames,
                 'emitted');
        return app;
    };
    return Promise.race([
                            new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    saveAppConfigEvents();
                                    return reject("Could not configure Application");
                                }, 1000)
                            }),
                            applicationConfiguration.configure(new Application)
                                                    .then(saveAppConfigEvents)
                        ]);
    
}

//
//
// SET THE APPLICATION CONFIGURATION VARIABLES

// We can pass these in as the arguments to the script we run from the command line.
//      Requires appPath to be set. Assumes the configPath and srcPath are either passed in or derived from the appPath
const [_1, _2, appPath, configPath__ARG, srcPath__ARG] = process.argv;

const configPath = configPath__ARG || `${appPath}/config`;
const srcPath    = srcPath__ARG || `${appPath}/src`;

//  HELPER FUNCTIONS

/**
 * Save the configuration of an object to a .json file named filename.json
 * in the location we use to save the configurations
 *
 * @param configuredItem
 * @param filename
 */
function saveJSON(configuredItem, filename) {
    const jsonModels   = JSON.stringify(configuredItem, ' ', 3);
    const entitiesPath = `${configPath}/out/${filename}.json`;
    fs.writeFile(entitiesPath,
                 jsonModels,
                 err => {
                     if (err) return console.log(err);
                     console.log("The file was saved to " + entitiesPath);
                 });
}

/**
 * Replace the boilerplate constants used in these files to serve as a placeholder for another string of text.
 * Example: APP_NAMESPACE would be replaced by the app.namespace
 * @param {Application} app
 * @return {Promise|null}
 */
function replaceAppBoilerplateConstants(app) {
    if (!app.namespace) return;
    const options = {
        files: [srcPath + '/**/*', configPath + '/config.php'],
        from:  new RegExp('WANGHORN', 'g'),
        to:    app.namespace,
    };
    return replace(options)
        .then(changes => console.log('Replaced the default namespace in :\n\t', changes.join(',\n\t')))
        .catch(error => console.error('Error occurred:', error));
}