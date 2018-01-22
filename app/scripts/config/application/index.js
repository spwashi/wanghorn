// APP CONFIGURATION
import config from "./config";
import {Application, ApplicationConfiguration} from "./lib/SmJS/src/components/sm/application/application";
////////////////////////////////////////////////////////////////
import fs from "fs";

import stripJsonComments from "strip-json-comments";

console.log('-'.repeat(25));
////////////////////////////////////////////////////////////////

//
//      INITIALIZE THE APPLICATION
//

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

const readConfiguration = (configFilePath): Promise<{}> => {
    const configFileIsJSON = filepath => filepath.split('.').reverse().shift() === 'json';
    
    if (configFileIsJSON(configFilePath)) {
        let readConfigFile = resolve => {
            return fs.readFile(configFilePath, 'utf8', onReadFile);
            
            function onReadFile(err, text) {
                let getConfigObjFromString = str => JSON.parse(stripJsonComments(str));
                let configObj              = getConfigObjFromString(text);
                resolve(configObj);
            }
        };
        
        return new Promise(readConfigFile);
    }
};
readConfiguration(baseJsonConfigFilePath)
    .then(configObj => {
        
        const applicationConfiguration = new ApplicationConfiguration({
                                                                          ...configObj,
                                                                          // APPLICATION ENTITY CONFIGURATION (models, routes, etc)
                                                                          ...applicationEntityConfiguration
                                                                      });
        return applicationConfiguration.configure(new Application)
    })
    .catch(i => console.error(i))
    .then((r: Application) => {
        const jsonModels = JSON.stringify(r.models, ' ', 3);
        console.log(jsonModels);
        const entitiesPath = configPath + '/_generated/_entities.json';
        console.log(entitiesPath);
        fs.writeFile(entitiesPath,
                     jsonModels,
                     err => {
                         if (err) return console.log(err);
            
                         console.log("The file was saved!");
                     });
    })
    .then(r => console.log(' -- '));