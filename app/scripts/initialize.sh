#!/usr/bin/env bash

source ./CONFIG.sh

cd ${SM_SITE_ROOT}
composer install

cd ${APPLICATION_PATH}
npm install

cd scripts

./build/SmFramework/update_smphp__github.sh
./initApplication.sh