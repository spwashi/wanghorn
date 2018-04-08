#!/bin/bash


APPLICATION_PATH=''
APPLICATION_CONFIG_PATH=''
SM_SITE_ROOT=''

if [ -p /dev/stdin ]; then
        read APPLICATION_PATH
        read APPLICATION_CONFIG_PATH
        read SM_SITE_ROOT
else
        if [ -f "$1" ]; then
            APPLICATION_PATH=$1
            APPLICATION_CONFIG_PATH=$2
            SM_SITE_ROOT=$3
        fi
fi

##

if [[ -z APPLICATION_PATH ]];then
    echo "NO APPLICATION PATH SPECIFIED - either pipe in the application path as the first line or pass it in as the first argument."
    return 1
fi



##
###
####     INITIALIZE CONFIGURATION
###
##
function initSmJS {
    if [[ -z $1 ]];then
        echo "NO APPLICATION PATH SPECIFIED - either pipe in the application path as the first line or pass it in as the first argument."
        return 1
    fi

    local FUNCTION_DESCRIPTION="Initialize the SmJS Framework and configure the application."
    printf "'''\n${FUNCTION_DESCRIPTION}\n'''\n\tIN: \t$(pwd) \n"

    local app_path=$1
    local config_path=$2
    local scripts_path="${app_path}/scripts"
    local smJS_path="${scripts_path}/node_modules/spwashi-sm"
    local appConfigJS_path="${app_path}/"
    local SM_JS_URL="https://github.com/spwashi/SmJS.git"

    ## Create the folder

    #printf "\tDELETING ${smJS_path} \n\n"
    #rm -rf "${smJS_path}"

    printf "\tCREATING FOLDER: \t${smJS_path} \n"

    mkdir -p ${smJS_path}

    cd ${appConfigJS_path}

    ## Configure the application
    FUNCTION_DESCRIPTION="2) Configure the application"
    printf "\t'''\n${FUNCTION_DESCRIPTION}\n'''\n\t IN: \t$(pwd) \n"
    printf "\tACTING IN: \t$(pwd) \n"

    node --require babel-register initialize.js ${app_path} ${config_path}

    cd ${app_path}
    FUNCTION_DESCRIPTION="3) Create the app's views"
    printf "\t'''\n${FUNCTION_DESCRIPTION}\n'''\n\t IN: \t$(pwd) \n"
    printf "\tACTING IN: \t$(pwd) \n"

    npm run webpack
}




##
###
####     INITIALIZE THE APPLICATION
###
##
function initApplication {
    cd ${APPLICATION_PATH}

    local FUNCTION_DESCRIPTION="Initialize the application"
    printf "'''\n${FUNCTION_DESCRIPTION}\n'''\n"


    printf "\tUSING: \tAPPLICATION_PATH - ${APPLICATION_PATH} \n"
    printf "\tUSING: \tAPPLICATION_CONFIG_PATH - ${APPLICATION_CONFIG_PATH} \n"



    initSmJS ${APPLICATION_PATH} ${APPLICATION_CONFIG_PATH}
}



printf " --initApplication------------------------------------------- \n\n"
initApplication
printf " --initApplication-end--------------------------------------- \n\n"