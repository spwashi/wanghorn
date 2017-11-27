import {Sm} from '../../Sm'
import {ApplicationConfiguration as AppConfiguration} from "./Configuration";
import stripJsonComments from "strip-json-comments";
import mkdirp from "mkdirp";
import fs from "fs";

let createFileAndDirectory = function (text, dirname, endFileName) {
    const createFile     = (filename) => {
        fs.writeFile(filename,
                     text,
                     {flag: 'w'},
                     error => {
                         error && console.error(error);
                     });
    };
    const onFolderCreate = err => {
        if (err) {
            console.error(err);
            return;
        }
        createFile(endFileName);
    };
    
    mkdirp(dirname, onFolderCreate);
};

class Application extends Sm.entities.ConfiguredEntity {
    static Configuration = AppConfiguration;
           _name;
           _controller: { namespace: string };
           _urls: {
               _: string,
        
               resources: {
                   css: string,
                   js: string
               }
           }             = {};
           _paths: {
               app: string,
               config: string,
               models: string,
               routes: string
           }             = {};
           _namespace;
    
    get namespace() {return ((this._namespace + '\\') || '\\');}
    
    get name() {return this._name;}
    
    get jsonFields() {
        return new Set(['name', 'namespace', 'controller', 'paths'])
    }
    
    configure(config: Sm.entities.ConfiguredEntity._config | string) {
        if (typeof config !== 'string') {
            return super.configure(config);
        }
        
        const configFileIsJSON = filepath => filepath.split('.').reverse().shift() === 'json';
        
        const configFilePath = config;
        
        if (configFileIsJSON(configFilePath)) {
            const fs = require('fs');
            
            let readConfigFile = resolve => fs.readFile(configFilePath,
                                                        'utf8',
                                                        (err, text) => {
                                                            let getConfigObjFromString = (str) => JSON.parse(stripJsonComments(str));
                                                            let configObj              = getConfigObjFromString(text);
                                                            let configResult           = this.configure(configObj);
                                                            resolve(configResult);
                                                        });
            return new Promise(readConfigFile);
            
        }
    }
    
    createConfigRequireFile() {
        const configPath      = this._paths.config;
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
            
            const path     = this._paths[index];
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
        const dir_name    = this._paths.config + '_generated';
        const endFileName = `${dir_name}/${name}`;
        
        createFileAndDirectory(JSON.stringify(configuration),
                               dir_name,
                               endFileName);
    }
    
    saveConfig() {
        const dir_name    = this._paths.config + '_generated';
        const file        = '_config.json';
        const endFileName = `${dir_name}/${file}`;
        
        createFileAndDirectory(JSON.stringify(this),
                               dir_name,
                               endFileName);
    }
    
    toJSON__controller() {
        return Object.assign({}, this._controller, {namespace: this.namespace + this._controller.namespace + '\\'});
    }
    
    toJSON__paths() {
        return this._paths;
    }
}

export {Application}