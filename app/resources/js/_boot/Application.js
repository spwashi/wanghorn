import {initAppConfiguration} from "./AppConfiguration"

let createFileAndDirectory = function (text, dirname, endFileName) {
    const createFile = (filename) => {
        fs.writeFile(filename,
                     text,
                     {flag: 'w'},
                     error => {
                         console.log(error);
                     });
    };
    
    mkdirp(dirname,
           function (err) {
               if (err) {
                   console.error(err);
                   return;
               }
               createFile(endFileName);
           });
};
const fs                   = require('fs');
const stripJsonComments    = require('strip-json-comments');
const mkdirp               = require('mkdirp');

export const initApplicationClass = Sm => {
    const AppConfiguration = initAppConfiguration(Sm);
    return class Application extends Sm.entities.ConfiguredEntity {
        _name;
        _namespace;
        _controller: { namespace: string };
        
        paths: {
            app: string,
            config: string,
            models: string,
            routes: string
        } = {};
        
        static Configuration = AppConfiguration;
        
        configure(config: Sm.entities.ConfiguredEntity._config) {
            if (typeof config !== 'string') {
                return super.configure(config);
            }
            
            if (config.split('.').reverse().shift() === 'json') {
                const json_config_file_name = config;
                const fs                    = require('fs');
                
                return new Promise((resolve, error) => {
                    fs.readFile(json_config_file_name,
                                'utf8',
                                (err, text) => {
                                    let configuration = JSON.parse(stripJsonComments(text));
                        
                                    resolve(this.configure(configuration));
                                })
                });
                
            }
        }
        
        createConfigRequireFile() {
            const configPath      = this.paths.config;
            const requireFileName = configPath + 'index.js';
            
            const directories_to_check = new Set(['models',
                                                  'routes',
                                                  'sources']);
            
            const resolvedPaths = [];
            const lines         = [];
            
            directories_to_check.forEach(index => {
                let resolve, reject;
                let P = new Promise((res, rej) => {
                    [resolve, reject] =
                        [res, rej];
                });
                resolvedPaths.push(P);
                
                const path     = this.paths[index];
                const filename = path + (index) + '.js';
                
                fs.exists(filename,
                          exists => {
                              if (!exists) {
                                  resolve();
                                  return;
                              }
                              lines.push(`export {default as ${index}} from './${index}/${index}';`);
                              resolve();
                          })
            });
            
            return Promise.all(resolvedPaths)
                          .then(i => {
                              let resolve, reject;
                
                              const P = new Promise((res, rej) => {
                                  [resolve, reject] =
                                      [res, rej]
                              });
                
                              fs.writeFile(requireFileName, lines.join('\n'), error => {
                                  if (error) {
                                      reject(error);
                                      return;
                                  }
                    
                                  resolve(true);
                              });
                
                              return P;
                          });
        }
        
        storeEntityConfig(configuration, name) {
            const dir_name    = this.paths.config + '_generated';
            const endFileName = `${dir_name}/${name}`;
            
            createFileAndDirectory(JSON.stringify(configuration),
                                   dir_name,
                                   endFileName);
        }
        
        get jsonFields() {
            return new Set(['name', 'namespace', 'controller', 'paths'])
        }
        
        get namespace() {return ((this._namespace + '\\') || '\\');}
        
        toJSON__controller() {
            return Object.assign({}, this._controller, {namespace: this.namespace + this._controller.namespace + '\\'});
        }
        
        saveConfig() {
            const dir_name    = this.paths.config + '_generated';
            const file        = '_config.json';
            const endFileName = `${dir_name}/${file}`;
            
            createFileAndDirectory(JSON.stringify(this),
                                   dir_name,
                                   endFileName);
        }
    };
};