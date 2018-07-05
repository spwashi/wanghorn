import {Sm}                             from "spwashi-sm";
import {connection}                     from "../../config/pre/connection";
import {createConfigOutput, saveJSON}   from "./save";
import {models}                         from "../../config/pre/models";
import routes
                                        from "../../config/pre/routes/index";
import {__CONFIGURATION__}              from "../../config/config";
import {replaceAppBoilerplateConstants} from "./setup";
import entities                         from "../../config/pre/entities";

const ApplicationConfiguration    = Sm.ApplicationConfiguration;
const Application                 = Sm.Application;
const getAppConfig                = function () {
	return {
		name:        __CONFIGURATION__.APP_NAME,
		namespace:   __CONFIGURATION__.APP_NAMESPACE,
		environment: __CONFIGURATION__.ENVIRONMENT,
		connection,
		models,
		entities,
		routes,

		rootUrl:     __CONFIGURATION__.URL_PATHS.ROOT,
		baseUrlPath: __CONFIGURATION__.URL_PATHS.BASE_PATH,

		urls:  {
			public: __CONFIGURATION__.URL_PATHS.PUBLIC
		},
		paths: {
			app:    __CONFIGURATION__.DIR_PATHS.APPLICATION,
			public: __CONFIGURATION__.DIR_PATHS.PUBLIC,
			config: __CONFIGURATION__.DIR_PATHS.CONFIG,
		}
	};
};
export const configureApplication = () =>
	initAppWithConfig(getAppConfig())
		.then(app => createConfigOutput(app, getAppConfig().paths.config))
		.then(app => replaceAppBoilerplateConstants(app, getAppConfig().paths.app))
		.catch(e => console.log(e));

export default configureApplication;

export function initAppWithConfig(appConfig: appConfig): Application {
	let applicationConfiguration = new ApplicationConfiguration(appConfig);
	let cancel                   = false;
	let saveEventsAndDie         = new Promise((resolve, reject) => {
		return setTimeout(
			i => {
				!cancel && saveAppConfigEvents();
				return reject("Could not configure Application");
			},
			1000);
	});
	return Promise.race([
		                    saveEventsAndDie,
		                    applicationConfiguration.configure(new Application)
		                                            .then(saveAppConfigEvents)
		                                            .then(i => ((cancel = true) && i))
	                    ]);

	function saveAppConfigEvents(app: Application) {
		saveJSON(applicationConfiguration.eventManager.emittedEventNames,
		         'emitted',
		         getAppConfig().paths.config);
		return app;
	}

}
type appConfig = { models: {}, routes: {}, name: string, namespace: string, domain: string, urlPath: string };