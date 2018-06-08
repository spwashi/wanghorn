#!/bin/bash

printf "UPDATING THE SmPHP Framework from the filesystem \n\n"

#
local_smphp_root="/home/sam/git/smphp"

#
APPLICATION_PATH=''
APPLICATION_CONFIG_PATH=''
SM_SITE_ROOT=''

if [ -p /dev/stdin ]; then
        read APPLICATION_PATH
        read APPLICATION_CONFIG_PATH
        read SM_SITE_ROOT
else
        # Checking to ensure a filename was specified and that it exists
        if [ -f "$1" ]; then
            APPLICATION_PATH=$1
            APPLICATION_CONFIG_PATH=$2
            SM_SITE_ROOT=$3
        fi
fi


site_root="${SM_SITE_ROOT}"

vendor_spwashi_path="vendor/spwashi"
vendor_spwashi_path_smphp="${vendor_spwashi_path}/smphp"

printf "ACTING IN ${site_root}\n\n"
cd "${site_root}"


printf "DELETING ${vendor_spwashi_path_smphp} \n\n"
rm -rf "${vendor_spwashi_path_smphp}"


printf "Creating directory for ${vendor_spwashi_path_smphp} \n\n"
if [ ! -d "${vendor_spwashi_path_smphp}" ]; then
  mkdir -p "${vendor_spwashi_path_smphp}"
fi


echo "COPYING REPO..." && ls
cp -r "${local_smphp_root}/src" "${vendor_spwashi_path_smphp}"