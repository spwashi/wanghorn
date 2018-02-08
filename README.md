# wanghorn


Wanghorn is a personal playground project meant to help develop my skills as an architect and provide me with intimate knowledge of an extensible system I could use to experiment with other technologies. The Backend is written in a PHP framework I built called SmPHP.

The application is configured using a small JS library I wrote called SmJS. This allows us to flexibly configure Models, Entities, and their Properties, saving the output as JSON which is loaded by PHP into memory. Caching is not yet implemented but is planned for future versions.

# System requirements
Wanghorn has only been tested on 
* Ubuntu 16.04 
* Node 7.10
* PHP 7.1
* Apache 2.4.25


# Installation

1. Clone the project into its desired site root
2. Configure the CONFIG.sh, config.js, and config.php files to set the variables your app needs.

   For more flexible configuration, feek free to tweak the ```app/index.php``` file.
3. run the ```initialize``` script to get the default application structure complete. 
I've typically installed this on my personal computer at ```/var/www/SITE_ROOT_FOLDER_NAME```.

```shell
git clone https://github.com/spwashi/wanghorn SITE_ROOT_FOLDER_NAME

# ( 
#     Here is where you'd configure the following:
#
#     SITE_ROOT_FOLDER_NAME/app/scripts/CONFIG.sh
#        At the top of the file, 
#           APP_NAME  whatever your app should be named (no spaces) (used as output filename for webpack)
#           APP_NAMESPACE  whatever PHP's namespace for your application should be (autoloads to the src/ directory)
#
#     SITE_ROOT_FOLDER_NAME/app/config/config.js
#        CONFIG.sh will take care of replacing "wanghorn" here,
#           but you might want to configure the application URL to be something different.
#
#     SITE_ROOT_FOLDER_NAME/app/config/config.php
#        CONFIG.sh will take care of replacing "wanghorn" here,
#           but you might want to configure the application URL to be something different.
# )


cd SITE_ROOT_FOLDER_NAME/app/scripts
./initialize.sh
```

At this point, if you've installed this as a folder under your localhost, you might be able to access it by following [http://localhost/SITE_ROOT_FOLDER_NAME](http://localhost/SITE_ROOT_FOLDER_NAME).

# Configuration

There are a few main places we might go to configure this application. Most are located in the ```app/``` directory.

1. app/config/config.php

   Registers the various modules/settings each Layer of the application needs to properly run
2. app/config/config.js
   
   Establishes the URLs, names, and path settings that webpack and React will use for their settings

3. app/index.php

   We assume that the directory in which the application source will reside is in the app/ directory located in the same directory as this file. As of right now, those are the only configurable aspects of this file (beyond modifying the code further for more specific needs)
   
   
4. app/config/routes/routes.js

   This is where routes are set (to later be serialized to JSON)
5. app/config/models/models.js
   
   This is where Models are configured (to be serialized to JSON using ```app/scripts/initApplication.sh``` and read by ```app/config/config.php``` to configure the applications Data Layer)
5. app/webpack.config.js

   Configures the webpack workflow
