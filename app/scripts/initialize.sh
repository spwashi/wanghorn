#!/usr/bin/env bash

source ./CONFIG.sh

set -e

cd ${SM_SITE_ROOT}
composer install
mkdir -p public/html

cd ${APPLICATION_PATH}
npm install

cd scripts

./build/SmFramework/update_smphp__github.sh
./initApplication.sh