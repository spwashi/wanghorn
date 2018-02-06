#!/usr/bin/env bash

APPLICATION_PATH=''
APPLICATION_CONFIG_PATH=''
SM_SITE_ROOT=''
APP_NAME=''
APP_NAMESPACE=''


if [ -p /dev/stdin ]; then
        read APPLICATION_PATH
        read APPLICATION_CONFIG_PATH
        read SM_SITE_ROOT
        read APP_NAME
        read APP_NAMESPACE
else
        if [ -f "$1" ]; then
            APPLICATION_PATH=$1
            APPLICATION_CONFIG_PATH=$2
            SM_SITE_ROOT=$3
            APP_NAME=$4
            APP_NAMESPACE=$5
        fi
fi

##

if [[ -z APPLICATION_PATH ]];then
    echo "NO APPLICATION PATH SPECIFIED - either pipe in the application path as the first line or pass it in as the first argument."
    return 1
fi

find "${APPLICATION_CONFIG_PATH}" -type f -name "*config.js" -print0 -o -type f -name "*config.php" -print0 | xargs -0 sed -i "s/wanghorn/${APP_NAME}/g"
find "${APPLICATION_CONFIG_PATH}" "${APPLICATION_PATH}/src" -type f -name "*.php" -print0 -o -type f -name "*config.php" -print0 | xargs -0 \
    sed -i "s/WANGHORN/${APP_NAMESPACE}/g"