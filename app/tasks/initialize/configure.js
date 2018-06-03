import {Sm} from "spwashi-sm";
import {createConfigOutput, saveJSON} from "./save";
import {models} from "../../config/pre/models";
import routes from "../../config/pre/routes/index";
import {APP_BASE_URL_PATH, APP_NAME, APP_NAMESPACE, APP_PATH__APP_DIR, APP_PATH__CONFIG_DIR, APP_PATH__PUBLIC_DIR, APP_ROOT_URL, APP_URL__PUBLIC, ENVIRONMENT} from "../../config/config";
import {replaceAppBoilerplateConstants} from "./setup";
import entities from "../../config/pre/entities";

const ApplicationConfiguration    = Sm.ApplicationConfiguration;
const Application                 = Sm.Application;
const getAppConfig                = function () {
    return {
        name:        APP_NAME,
        namespace:   APP_NAMESPACE,
        environment: ENVIRONMENT,
        
        models,
        entities,
        routes,
        
        rootUrl:     APP_ROOT_URL,
        baseUrlPath: APP_BASE_URL_PATH,
        
        urls:  {
            public: APP_URL__PUBLIC
        },
        paths: {
            app:    APP_PATH__APP_DIR,
            public: APP_PATH__PUBLIC_DIR,
            config: APP_PATH__CONFIG_DIR,
        }
    };
};
export const configureApplication = () =>
    initAppWithConfig(getAppConfig())
        .then(app => createConfigOutput(app, APP_PATH__CONFIG_DIR))
        .then(app => replaceAppBoilerplateConstants(app, APP_PATH__APP_DIR))
        .catch(e => console.log(e));

export default configureApplication;

export function initAppWithConfig(appConfig: appConfig): Application {
    let applicationConfiguration = new ApplicationConfiguration(appConfig);
    let cancel                   = false;
    let saveEventsAndDie         = new Promise((resolve, reject) => {
        return setTimeout(i => {
            !cancel && saveAppConfigEvents();
            return reject("Could not configure Application");
        }, 1000);
    });
    return Promise.race([
                            saveEventsAndDie,
                            applicationConfiguration.configure(new Application)
                                                    .then(saveAppConfigEvents)
                                                    .then(i => ((cancel = true) && i))
                        ]);
    
    function saveAppConfigEvents(app: Application) {
        saveJSON(applicationConfiguration.eventManager.emittedEventNames, 'emitted', APP_PATH__CONFIG_DIR);
        return app;
    }
    
}
type appConfig = { models: {}, routes: {}, name: string, namespace: string, domain: string, urlPath: string };