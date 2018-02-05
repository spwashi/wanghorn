#!/usr/bin/env bash

set -e

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
if [[ -z SM_SITE_ROOT ]];then
    echo "NO SITE_ROOT PATH SPECIFIED - either pipe in the application path as the first line or pass it in as the first argument."
    return 1
fi



vendor_spwashi_path="${SM_SITE_ROOT}/vendor/spwashi"

cd ${vendor_spwashi_path}
cd ..

printf "ACTING IN ..." && pwd
rm -rf "${vendor_spwashi_path}/smphp" && printf " -- DELETED ${vendor_spwashi_path}\n" && ls spwashi && printf "\n\n"

if [ ! -d "$vendor_spwashi_path" ]; then
  mkdir "${vendor_spwashi_path}"
fi
cd "${vendor_spwashi_path}"

printf "CLONING REPO...\n\n" && ls
git clone "https://github.com/spwashi/SmPHP.git" smphp