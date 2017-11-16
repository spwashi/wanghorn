import {initApplicationClass} from "./Application";

/////////////////////////////////////////////////////////////

export const app_loader = {
    // Establish the paths of the app
    setBase: ({appPath, configPath}, Sm: Sm) => {
        const config_1 = {appPath, configPath};
        
        const Application = initApplicationClass(Sm);
        const app         = new Application;
        
        return Promise.all([
                               app.configure(config_1),
                               app.configure(config_1.configPath + '/base.json')
                           ])
                      .then(i => {return app});
        
    }
};