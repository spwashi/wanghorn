// SM
import Sm from "./lib/SmJS/src"
import {initializeOfType, PHP_Application} from "./lib/SmJS/src/_config";
import ConfiguredEntity from "./lib/SmJS/src/entities/ConfiguredEntity";

// APP CONFIGURATION
import * as config from "./config";

////////////////////////////////////////////////////////////////
console.log(''.repeat(25));
////////////////////////////////////////////////////////////////

//
//      INITIALIZE THE APPLICATION
//
const app = new PHP_Application;

// SET THE APPLICATION CONFIGURATION VARIABLES
const appPath                        = process.argv[2];
const getConfigPath                  = () => {
    const configPath__ARG   = process.argv[3];
    const assumedConfigPath = `${appPath}/config`;
    
    if (!configPath__ARG) console.log(`NOTE:\t ASSUMING CONFIG PATH TO BE ${assumedConfigPath}`);
    
    return configPath__ARG || assumedConfigPath;
};
const configPath                     = getConfigPath();
const baseJsonConfigFilePath         = `${configPath}/base.json`;
const applicationEntityConfiguration = config;

//
//      CONFIGURE THE APPLICATION
//
app.configure({appPath, configPath})
   .then(app => {
       return Promise.all([
                              // APPLICATION SETTINGS
                              app.configure(baseJsonConfigFilePath),
        
                              // APPLICATION ENTITY CONFIGURATION (models, routes, etc)
                              app.configure(applicationEntityConfiguration),
                          ])
   })
   .catch(i => console.error(i))
   .then(r => console.log(' -- '));

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