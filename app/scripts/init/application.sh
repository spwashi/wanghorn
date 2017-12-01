#!/bin/bash


APPLICATION_PATH=''

##
###
####     MAKE SURE APP PATH IS SET
###
##
if [ -p /dev/stdin ]; then
        read APPLICATION_PATH
else
        # Checking to ensure a filename was specified and that it exists
        if [ -f "$1" ]; then
            APPLICATION_PATH=$1
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


    printf "ACTING IN: \t$(pwd) \n"

    local app_path=$1
    local scripts_path="${app_path}/scripts"
    local smJS_path="${scripts_path}/config/application/lib/SmJS"


    local SM_JS_URL="https://github.com/spwashi/SmJS.git"


    printf "CREATING FOLDER: \t${smJS_path} \n"


    mkdir -p ${smJS_path}
    cd ${smJS_path}

    printf "ACTING IN: \t$(pwd) \n"
    printf "CLONING: \t${SM_JS_URL} \n"

    git clone ${SM_JS_URL} ${smJS_path}

    cd ../../
    printf "ACTING IN: \t$(pwd) \n"

    node --require babel-register index.js ${app_path}


}



##
###
####     INITIALIZE THE APPLICATION
###
##
function initApplication {
    cd ${APPLICATION_PATH}

    printf "ACTING IN: \t$(pwd) \n"

    initSmJS ${APPLICATION_PATH}
}



printf " --- \n\n"
initApplication
printf " --- \n\n"