#!/bin/bash


function init_path  {
    # set variables
    local SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
    local APPLICATION_PATH="${SCRIPTS_DIR}/../"

    echo "$(readlink -f "${APPLICATION_PATH}")"
}

function echoReadableInformation {
    printf "For the application loaded at:\n"
    printf "\t \"${APPLICATION_PATH}\" \n"
}


APPLICATION_PATH="$(init_path)"


echo "${APPLICATION_PATH}"