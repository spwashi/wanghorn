// SM
import Sm from "./lib/SmJS/src"
import {initializeOfType, PHP_Application} from "./lib/SmJS/src/_config";
import ConfiguredEntity from "./lib/SmJS/src/entities/ConfiguredEntity";

import * as config from "./config";
import {app_loader} from './load'

////////////////////////////////////////////////////////////////

//
//      INITIALIZE THE APPLICATION
//
const app = new PHP_Application;

//
const appPath         = process.argv[2];
const configPath      = appPath + '/config';
const baseJSON_config = configPath + '/base.json';

const appIsAllConfigured = Promise.all([
                                           app.configure({appPath, configPath}),
                                           app.configure(baseJSON_config),
                                           app.configure(config),
                                       ]);
const initApplication    = app_loader.setBase(setup, Sm);

initApplication.then((application: PHP_Application) => {
                   const models  = config.models;
                   const sources = config.sources;
    
                   const configuredModels     = configureEntityType(models, Sm.entities.Model);
                   const configuredDataSource = configureEntityType(sources, Sm.entities.DataSource);
    
                   return Promise.all([configuredDataSource, configuredModels])
               })
               .catch(i => console.error(i))
               .then(r => console.log(r));

function configureEntityType(getConfig, EntityPrototype) {
    return application => {
        let initializedModels = null;
        
        if (getConfig) {
            initializedModels = getConfig(Sm).then(initEntityType);
        }
        
        return Promise.resolve(initializedModels)
                      .catch(error => console.log(error))
                      .then(completedModelPromises => [application, completedModelPromises]);
    };
    
    function initEntityType(configuration_object): Promise<Array<ConfiguredEntity>> {
        // console.log(configuration_object);
        return initializeOfType(configuration_object, EntityPrototype);
    }
}