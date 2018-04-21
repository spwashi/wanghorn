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
####     INITIALIZE THE APPLICATION
###
##
function initApplication {
    printf "\tUSING: \tAPPLICATION_PATH - ${APPLICATION_PATH} \n"

    cd ${APPLICATION_PATH}

    printf "\n......Installing Node Packages......\n"
    npm install -dd
    printf "\n...... Done Installing Node Packages......\n"

    printf "\n......Initializing app variables......\n"
    node --require babel-register initialize.js ${APPLICATION_PATH}
    printf "\n\n... Done Initializing app variables\n"


    printf "\n......Building App Views......\n"
    npm run webpack
    printf "\n......Done Building App Views......\n"
}



printf " --initApplication------------------------------------------- \n\n"
initApplication
printf " --initApplication-end--------------------------------------- \n\n"