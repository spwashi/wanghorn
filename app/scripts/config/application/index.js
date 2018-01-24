// APP CONFIGURATION
import {default as applicationEntityConfiguration} from "./config";
import {Application, ApplicationConfiguration} from "./lib/SmJS/src/components/sm/application/application";
////////////////////////////////////////////////////////////////
import fs from "fs";

console.log('-'.repeat(25));
////////////////////////////////////////////////////////////////

//
//      INITIALIZE THE APPLICATION
//

// SET THE APPLICATION CONFIGURATION VARIABLES
const [appPath, configPath__ARG] = [process.argv[2], process.argv[3]];
const getConfigPath              = passedInArg => {
    const assumedConfigPath = `${appPath}/config`;
    if (!passedInArg) console.log(`NOTE:\t ASSUMING CONFIG PATH TO BE ${assumedConfigPath}`);
    return passedInArg || assumedConfigPath;
};
const configPath                 = getConfigPath(configPath__ARG);
const applicationConfiguration   = new ApplicationConfiguration({
                                                                    // APPLICATION ENTITY CONFIGURATION (models, routes, etc)
                                                                    ...applicationEntityConfiguration
                                                                });

applicationConfiguration.configure(new Application)
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