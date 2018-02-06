#!/usr/bin/env bash

source ./CONFIG.sh

cd ${SM_SITE_ROOT}
composer install
mkdir -p public/html

cd ${CONFIG_PATH}
mkdir -p _generated

cd ${APPLICATION_PATH}
npm install

cd scripts

./CONFIG.sh | ./build/SmFramework/update_smphp__github.sh
./CONFIG.sh | ./init/renameWanghorn.sh
./CONFIG.sh | ./init/application.sh