import {Sm} from "spwashi-sm"
import fs from "fs";
import {ENVIRONMENT} from "../../config/config";
import {Route} from "../../config/pre/routes/route";
import {connection} from "../../config/pre/connection";

const Application = Sm.Application;
// Generate config files used by SmPHP
export function createConfigOutput(app: Application, configPath) {
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
    let save = (conf, name) => saveJSON(conf, name, configPath);
    save(config, 'config');
    save(connection, 'connect');
    save(configPublic, 'public');
    save(models, 'models');
    save(entities, 'entities');
    save(routes, 'routes');
    
    return app;
}
//Save the configuration of an object to a .json file named filename.json
export function saveJSON(configuredItem: {}, filename: string, configPath) {
    const jsonModels = JSON.stringify(configuredItem, ' ', 3);
    const location   = `${configPath}/out/${filename}.json`;
    fs.writeFile(location,
                 jsonModels,
                 err => {
                     if (err) return console.log(err);
                     console.log("The file was saved to " + location);
                 });
}