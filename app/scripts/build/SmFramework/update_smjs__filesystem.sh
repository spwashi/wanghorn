#!/bin/bash

printf "UPDATING THE SmJS Framework from the filesystem \n\n"

#
local_smJS_root="/var/www/SmJS"

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
smJS_path="${APPLICATION_PATH}/scripts/config/application/lib/SmJS"


printf "ACTING IN ${site_root}\n\n"
cd "${site_root}"


printf "DELETING ${smJS_path} \n\n"
rm -rf "${smJS_path}"


printf "Creating directory for ${smJS_path} \n\n"
if [ ! -d "${smJS_path}" ]; then
  mkdir -p "${smJS_path}"
fi


printf "COPYING REPO...into ${local_smJS_root}/src \n\n" && ls
cp -r "${local_smJS_root}/src" "${smJS_path}"