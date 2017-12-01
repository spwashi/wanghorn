#!/bin/bash


APPLICATION_PATH=''
APPLICATION_CONFIG_PATH=''

##
###
####     MAKE SURE APP PATH IS SET
###
##
if [ -p /dev/stdin ]; then
        read APPLICATION_PATH
        read APPLICATION_CONFIG_PATH
else
        # Checking to ensure a filename was specified and that it exists
        if [ -f "$1" ]; then
            APPLICATION_PATH=$1
            APPLICATION_PATH=$2
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
    printf "'''\n${FUNCTION_DESCRIPTION}\n'''\n\t IN: \t$(pwd) \n"

    local app_path=$1
    local config_path=$2
    local scripts_path="${app_path}/scripts"
    local smJS_path="${scripts_path}/config/application/lib/SmJS"
    local SM_JS_URL="https://github.com/spwashi/SmJS.git"

    ## Create the folder
    printf "\tCREATING FOLDER: \t${smJS_path} \n"

    mkdir -p ${smJS_path}
    cd ${smJS_path}


    ## Clone the framework
    FUNCTION_DESCRIPTION="1) Clone the SmJS Framework"
    printf "\t'''\n${FUNCTION_DESCRIPTION}\n'''\n\t IN: \t$(pwd) \n"
    printf "\t\tCLONING: \t${SM_JS_URL} \n"

    git clone ${SM_JS_URL} ${smJS_path}
    cd ../../

    ## Configure the application
    FUNCTION_DESCRIPTION="2) Configure the application"
    printf "\t'''\n${FUNCTION_DESCRIPTION}\n'''\n\t IN: \t$(pwd) \n"
    printf "ACTING IN: \t$(pwd) \n"

    node --require babel-register index.js ${app_path} ${config_path}


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



printf " --- \n\n"
initApplication
printf " --- \n\n"