import Sm from "./lib/SmJS/src"
import {app_loader} from "./_boot";
import * as config from "../../config";
import path from "path";

const appPath = path.resolve(__dirname, '..', '..');
const setup   = {
    appPath,
    configPath: appPath + '/config'
};

app_loader.setBase(setup, Sm)
          .then((application: Application) => {
              return application.createConfigRequireFile()
                                .then(e => application.saveConfig())
    
                                .then(e => application)
                                .then(configure_entity(config.models, Sm.entities.Model)).then(save_config('_entities.json'))
                                .then(e => application)
                                .then(configure_entity(config.sources, Sm.entities.DataSource)).then(save_config('_sources.json'))
          })
          .catch(i => {console.error(i);});

function configure_entity(getConfig, EntityPrototype) {
    return application => {
        let initializedModels = null;
        
        if (getConfig) {
            initializedModels = getConfig(Sm).then(_initializeModels);
        }
        
        return Promise.resolve(initializedModels)
                      .catch(error => console.log(error))
                      .then(completedModelPromises => [application, completedModelPromises]);
    };
    
    function _initializeModels(configuration_object) {
        console.log(configuration_object);
        const allInitializing = Sm._config.initialize(configuration_object, EntityPrototype);
        return Promise.all(allInitializing);
    }
}

function save_config(name) {
    return function (ar) {
        let [application, initializedModels] = ar;
        console.log(initializedModels);
        application.storeEntityConfig(initializedModels, name);
    }
}
