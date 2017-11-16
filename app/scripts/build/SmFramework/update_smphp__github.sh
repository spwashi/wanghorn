#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
vendor_spwashi_path="vendor/spwashi"

cd "${DIR}/../../../../"
rm -rf "${vendor_spwashi_path}/*"

if [ ! -d "$vendor_spwashi_path" ]; then
  mkdir "${vendor_spwashi_path}"
fi
cd "${vendor_spwashi_path}"

echo "CLONING REPO..." && ls
git clone "https://github.com/spwashi/SmPHP.git"

echo "RENAMING REPO..." && ls
mv "SmPHP" "smphp"