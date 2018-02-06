#!/bin/bash


function get_appPath__std  {
    # set variables
    local SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
    local APPLICATION_PATH="${SCRIPTS_DIR}/../"

    echo "$(readlink -f "${APPLICATION_PATH}")"
}


APPLICATION_PATH="$(get_appPath__std)"
CONFIG_PATH="${APPLICATION_PATH}/config"
SM_SITE_ROOT="$(dirname "${APPLICATION_PATH}")"

APP_NAME="wanghorn2"
APP_NAMESPACE="WANGHORN2"

echo "${APPLICATION_PATH}"
echo "${CONFIG_PATH}"
echo "${SM_SITE_ROOT}"
echo "${APP_NAME}"
echo "${APP_NAMESPACE}"
