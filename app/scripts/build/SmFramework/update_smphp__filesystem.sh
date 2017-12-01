#!/bin/bash

local_smphp_root="/var/www/SmPHP"
vendor_spwashi_path="vendor/spwashi"
vendor_spwashi_path_smphp="${vendor_spwashi_path}/smphp"



DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


cd "${DIR}/../../../../"
rm -rf "${vendor_spwashi_path_smphp}"

if [ ! -d "${vendor_spwashi_path_smphp}" ]; then
  mkdir -p "${vendor_spwashi_path_smphp}"
fi


echo "COPYING REPO..." && ls
cp -r "${local_smphp_root}/src" "${vendor_spwashi_path_smphp}"

echo "RENAMING REPO..."
cd "${vendor_spwashi_path}"