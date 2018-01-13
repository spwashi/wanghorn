// SM
import {PHP_Application} from "./lib/SmJS/src/_config";
// APP CONFIGURATION
import * as config from "./config";

////////////////////////////////////////////////////////////////
console.log('-'.repeat(25));
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
   .then(r => console.log(JSON.stringify(r)))
   .then(r => console.log(' -- '));