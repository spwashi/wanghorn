# wanghorn


Wanghorn is a personal dummy application that I started to learn more about software architecture (and software interoperability),
and it also serves as a bit of a code library to make it easier for me to implement consistently recurring web design features.

The application is configured using a small JS library I wrote called SmJS. This allows us to flexibly configure Models, Entities, and their Properties, saving the output as JSON which is loaded by PHP into memory.
The backend is based on a framework I built and named SmPHP.

Caching is not yet implemented but is planned for future versions.

# System requirements
Wanghorn has only been tested on 
* Ubuntu 17.10 and CentOS 7
* Node 7.10
* PHP 7.1/7.2
* Apache 2.4.25

```bash
git clone wanghorn/ wanghorn_test/; 
cd wanghorn_test/; 
phpstorm app/config/config.js
```

```bash
cd app;
npm run init;
node initialize;
```

# Installation

1. Clone the project into a folder named SITE_ROOT
2. Configure the SITE_ROOT/app/config/index.js file

   ```javascript
    // The domain name of the site we are configuring
    export const APP_ROOT_URL      = 'http://localhost';
    // The URL Path (sans leading or trailing slash) at which the main site can be found relative to the domain
    export const APP_BASE_URL_PATH = `wanghorn`;
    // The name of the application without spaces. Case sensitive, I recommend lowercase-with-dashes or camelCased
    export const APP_NAME          = `wanghorn`;
    // The namespace used in PHP to prefix app-specific files
    export const APP_NAMESPACE     = APP_NAME.toUpperCase();
    // The URL including the Path that we will use to access our files
    export const APP_URL           = `${APP_ROOT_URL}/${APP_BASE_URL_PATH}`;
    // URL for the public files (where we access the files output by webpack)
    export const APP_URL__PUBLIC   = `${APP_ROOT_URL}/public`;
    // The environment in which we are operating -- defaults to production for the sake of probable intention
    export const ENVIRONMENT       = process.env.NODE_ENV || 'production';
   ```
   
   To change more of the defaults, you might want to edit more of the ```app/config/config.js```, ```app/config/config.php```, or ```app/index.php``` files if you'd like a more custom solution (files listed in ascending order according to the need for customizability).
4. Run the ```init``` script to interpret the configuration JS files and save them in a location that can be read by the backend (PHP) or frontend.

   I've typically installed this on my personal computer at ```/var/www/SITE_ROOT_FOLDER_NAME```.

   ```shell
   cd SITE_ROOT_FOLDER_NAME/app
   npm run init
   ```
    * If you want to tweak the app/config/config.js file more later (or if you modify a file in app/config/pre/ ), you can run the same command which will update the configuration files located in ```app/config/out/```
    * This will create a public.json file at ```app/config/out/public.json``` which consists of the configuration that should be available to both the frontend and backend.
        * Right now there is not yet an implemented procedure for customizing the attributes of this JSON file.
    * At this point, if you've installed this at an accessible location (can read the index.php located at site root), you should be able to access it by following [http://APP_URL](http://APP_URL).

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
