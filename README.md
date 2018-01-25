# wanghorn


Wanghorn is a personal playground project meant to help develop my skills as an architect and provide me with intimate knowledge of an extensible system I could use to experiment with other technologies. The Backend is written in a PHP framework I built called SmPHP.

# Installation

Clone the project into its desired site root and run the ```initialize``` script to get the default application structure complete. I've typically installed this on my personal computer at ```/var/www/SITE_ROOT_FOLDER_NAME```.

```shell
git clone https://github.com/spwashi/wanghorn SITE_ROOT_FOLDER_NAME
cd SITE_ROOT_FOLDER_NAME/app/scripts
./initialize.sh
```

At this point, if you've installed this as a folder under your localhost, you might be able to access it by following [http://localhost/SITE_ROOT_FOLDER_NAME].

# Configuration

There are a few main places we might go to configure this application. Most are located in the ```app/``` directory.

1. app/index.php

   At the top of the file, you can choose to assign your application a name.
   We assume that the directory in which the application source will reside is in the app/ directory located in the same directory as this file. As of right now, those are the only configurable aspects of this file (beyond modifying the code further for more specific needs)
2. app/config/
3. app/config/routes/routes.json

   This is where routes are set
4. app/config/models/models.js
   
   This is where Models are configured (to be serialized to JSON using ```app/scripts/initApplication.sh``` and read by ```app/config/config.php``` to configure the applications Data Layer)
5. app/webpack.config.js

   At the top of this file, you can specify the name and URL of the project, which will be used by gulp to transpile JavaScript or preprocess CSS
