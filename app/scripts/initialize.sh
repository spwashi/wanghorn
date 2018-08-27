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
mkdir ../log/git


npm install

cd scripts

./CONFIG.sh | ./build/sm/update_smphp__github.sh

git branch -m master local
git branch dev.live
git branch prod.live

git checkout local

./initApplication.sh