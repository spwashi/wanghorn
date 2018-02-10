#!/usr/bin/env bash

source ./CONFIG.sh

cd ${SM_SITE_ROOT}

# git remote remove origin
# git remote add wanghorn https://github.com/spwashi/wanghorn.git
# git remote set-url --push wanghorn no-pushing

composer install
mkdir -p public/html

cd ${CONFIG_PATH}
mkdir -p out

cd ${APPLICATION_PATH}

npm install

cd scripts

./CONFIG.sh | ./build/SmFramework/update_smphp__github.sh