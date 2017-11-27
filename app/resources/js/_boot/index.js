import {Application} from "./Application/Application";

/////////////////////////////////////////////////////////////

export const app_loader = {
    // Establish the _paths of the app
    setBase: ({appPath, configPath}) => {
        const config_1 = {appPath, configPath};
        const app      = new Application;
        return Promise.all([
                               app.configure(config_1),
                               app.configure(config_1.configPath + '/base.json')
                           ])
                      .then(i => {return app});
        
    }
};