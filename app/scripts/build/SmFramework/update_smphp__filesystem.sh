#!/bin/bash

local_smphp_root="/var/www/SmPHP"
site_root="/var/www/wanghorn"

vendor_spwashi_path="vendor/spwashi"
vendor_spwashi_path_smphp="${vendor_spwashi_path}/smphp"


cd "${site_root}"
rm -rf "${vendor_spwashi_path_smphp}"

if [ ! -d "${vendor_spwashi_path_smphp}" ]; then
  mkdir -p "${vendor_spwashi_path_smphp}"
fi


echo "COPYING REPO..." && ls
cp -r "${local_smphp_root}/src" "${vendor_spwashi_path_smphp}"