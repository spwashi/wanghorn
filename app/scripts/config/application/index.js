// APP CONFIGURATION
import fs from "fs";
import * as applicationEntityConfiguration from '../../../config'
import {Application, ApplicationConfiguration} from "./lib/SmJS/src/components/sm/application/application";

//
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
                            const jsonModels   = JSON.stringify(r.models, ' ', 3);
                            const entitiesPath = configPath + '/_generated/_entities.json';
                            fs.writeFile(entitiesPath,
                                         jsonModels,
                                         err => {
                                             if (err) return console.log(err);
                                             console.log("The file was saved to " + entitiesPath);
                                         });
                        });