# wanghorn


Wanghorn is a personal playground project meant to help develop my skills as an architect and provide me with intimate knowledge of an extensible system I could use to experiment with other technologies. The Backend is written in a PHP framework I built called SmPHP.

The application is configured using a small JS library I wrote called SmJS. This allows us to flexibly configure Models, Entities, and their Properties, saving the output as JSON which is loaded by PHP into memory. Caching is not yet implemented but is planned for future versions.

# System requirements
Wanghorn has only been tested on 
* Ubuntu 17.04 and CentOS 7
* Node 7.10
* PHP 7.1/7.2
* Apache 2.4.25


# Installation

1. Clone the project into a folder named SITE_ROOT
2. Configure the SITE_ROOT/app/config/index.js file

   ```JavaScript
   // The domain name of the site we are configuring
   export const APP_DOMAIN    = 'http://localhost';
   // The URL Path (sans leading or trailing slash) at which the main site can be found relative to the domain
   export const APP_PATH      = `wanghorn`;
   // The name of the application without spaces. Case sensitive, I recommend lowercase-with-dashes or camelCased
   export const APP_NAME      = `wanghorn`;
   // The namespace used in PHP to prefix app-specific files
   export const APP_NAMESPACE = APP_NAME.toUpperCase();
   // The URL including the Path that we will use to access our files
   export const APP_URL       = `${APP_DOMAIN}/${APP_PATH}`;
   ```
   
   To change more of the defaults, you might want to edit more of the ```SITE_ROOT/app/config/index.js```, ```SITE_ROOT/app/config/config.php```, or ```SITE_ROOT/app/index.php``` files. 
4. run the ```initialize``` script to get the default application structure complete. 

   I've typically installed this on my personal computer at ```/var/www/SITE_ROOT_FOLDER_NAME```.

   ```shell
   cd SITE_ROOT_FOLDER_NAME/app/scripts
   ./initialize.sh
   ```
4. If you want to tweak the app/config/index.js file more later (or if you modify a file in app/config/pre/ ), you can run the app/initialize.js file to save the configuration to app/config/out/

3. Create the output config files and rename placeholder variables
   
   ```shell
   
   # If you can use a bash terminal, there is a script that can be run with no arguments
   
   cd SITE_ROOT/app/scripts
   ./initApplication.sh
   
   # If you don't have access to a bash terminal, you can just run the initialize.js script 
   #   Only the first argument to the initialize.js script is required (the path to the app/ folder (or whatever it's called)
   #   The other two arguments are assumed to be standard (unchanged from the default wanghorn app) and are the
   #     config path (./app/config) and the location containing the site index file/public dir (./)
   
   node --require babel-register initialize.js SITE_ROOT/app SITE_ROOT/app/config SITE_ROOT
   
   ```   

At this point, if you've installed this as a folder under your localhost, you should be able to access it by following [http://APP_DOMAIN/APP_PATH](http://APP_DOMAIN/APP_PATH).

# Configuration

There are a few main places we might go to configure this application. Most are located in the ```app/``` directory.

1. app/config/config.php

   Registers the various modules/settings each Layer of the application needs to properly run
2. app/config/index.js
   
   Establishes the URLs, names, and path settings that webpack and React will use for their settings

3. app/index.php

   We assume that the directory in which the application source will reside is in the app/ directory located in the same directory as this file. As of right now, those are the only configurable aspects of this file (beyond modifying the code further for more specific needs)
   
   
4. app/config/pre/routes/routes.js

   This is where routes are set (to later be serialized to JSON)
5. app/config/pre/models/models.js
   
   This is where Models are configured (to be serialized to JSON using ```app/scripts/initApplication.sh``` and read by ```app/config/config.php``` to configure the applications Data Layer).
   
   Models are meant to represent what might be one record in a database. The concept will hopefully expand beyond its current implementation as representing a row in a MySQL DB table.
6. app/config/pre/entities/entities.js
   
   Entities are objects that represent the ideological combination of Models that come together under a consistent identity. An example of an Entity might be a ```Person``` entity, which would act as an object merging the various identities a person might have on the site, such as their identity as a member of a group or their identity as a user of the site. The idea behind this concept is that each entity would understand how its identities exist in the contexts IT exists in, with the goal of creating a configurable method for initializing the properties/actions available to that entity in those contexts (and nothing more than what we'd need)
5. app/webpack.config.js

   Configures the webpack workflow
