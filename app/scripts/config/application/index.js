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
const applicationConfiguration   = new ApplicationConfiguration(applicationEntityConfiguration);

let saveApplicationIndex = function (item, filename) {
    const jsonModels   = JSON.stringify(item, ' ', 3);
    const entitiesPath = `${configPath}/_generated/${filename}.json`;
    fs.writeFile(entitiesPath,
                 jsonModels,
                 err => {
                     if (err) return console.log(err);
                     console.log("The file was saved to " + entitiesPath);
                 });
};
applicationConfiguration.configure(new Application)
                        .catch(i => console.error(i))
                        .then((app: Application) => {
                            saveApplicationIndex(app.models, 'entities');
                            saveApplicationIndex(app.routes, 'routes');
                        });