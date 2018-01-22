#!/bin/bash

local_smphp_root="/var/www/SmJS"
site_root="/var/www/wanghorn"

smJS_path="app/scripts/config/application/lib/SmJS"



cd "${site_root}"
rm -rf "${smJS_path}"

if [ ! -d "${smJS_path}" ]; then
  mkdir -p "${smJS_path}"
fi


echo "COPYING REPO..." && ls
cp -r "${local_smphp_root}/src" "${smJS_path}"