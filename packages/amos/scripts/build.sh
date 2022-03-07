#!/usr/bin/env bash
# @since 2022-03-07 15:26:59
# @author junbao <junbao@moego.pet>

set -xeuo pipefail

DIR_LIST=(lib react redux)

for dir in ${DIR_LIST[@]}; do
  rm -rf $dir/*.{js,js.map,d.ts}
done

yarn tsc --module commonjs --declaration false

for dir in ${DIR_LIST[@]}; do
  find $dir -type f -name '*.js' | sed 's/.js//' | xargs -I % mv %.js %.cjs.js
  find $dir -type f -name '*.js.map' | sed 's/.js.map//' | xargs -I % mv %.js.map %.cjs.js.map
done

yarn tsc --module es2015 --declaration true

for dir in ${DIR_LIST[@]}; do
  find $dir -type f -name '*.js' | grep -v '.cjs' | sed 's/.js//' | xargs -I % mv %.js %.esm.js
  find $dir -type f -name '*.js.map' | grep -v '.cjs' | sed 's/.js.map//' | xargs -I % mv %.js.map %.esm.js.map
done
