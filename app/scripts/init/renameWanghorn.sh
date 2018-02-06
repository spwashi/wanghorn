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



find "${APPLICATION_PATH}/config" -type f -name "*config.js" -type f -name "*config.php" -print0

