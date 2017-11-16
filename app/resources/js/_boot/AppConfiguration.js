let LEADING_TRAILING_SLASH_REGEX = /\/$/g;


export const initAppConfiguration = Sm => {
    return class AppConfiguration extends Sm.entities.ConfiguredEntity.Configuration {
        owner: Application;
        
        configure_name(name) {
            this.owner._name = name;
            return Promise.resolve(name);
        }
        
        configure_namespace(namespace) {
            this.owner._namespace = namespace;
            return Promise.resolve(namespace);
        }
        
        configure_paths(paths) {
            if (typeof paths !== "object") {
                return Promise.reject("Cannot configure non-object paths");
            }
            
            paths = paths || {};
            
            for (let pathIndex in paths) {
                if (!paths.hasOwnProperty(pathIndex)) continue;
                this.owner.paths[pathIndex] =
                    paths[pathIndex].replace('CONFIG_PATH', this.owner.paths.config.replace(LEADING_TRAILING_SLASH_REGEX, ''))
                                    .replace('APP_PATH', this.owner.paths.app.replace(LEADING_TRAILING_SLASH_REGEX, ''))
                                    .replace(LEADING_TRAILING_SLASH_REGEX, '') + '/';
            }
            
            return Promise.resolve(paths);
        }
        
        configure_appPath(appPath) {
            this.owner.paths.app =
                appPath.replace(LEADING_TRAILING_SLASH_REGEX, '') + '/';
            return Promise.resolve(appPath);
        }
        
        configure_configPath(configPath) {
            this.owner.paths.config =
                configPath.replace(LEADING_TRAILING_SLASH_REGEX, '') + '/';
            return Promise.resolve(configPath);
        }
        
        configure_controller(controllerObj) {
            controllerObj           =
                typeof controllerObj === "object" && controllerObj
                    ? controllerObj
                    : {};
            controllerObj.namespace =
                controllerObj.namespace || "Controller";
            this.owner._controller  = controllerObj;
            return Promise.resolve(controllerObj);
        }
        
    };
}
