#!/usr/bin/env bash
# @since 2022-03-07 20:00:01
# @author junbao <junbao@moego.pet>

NAME=$1

tsc --version

yarn npm-dts generate --entry src/index.ts --output dist/amos-$NAME.d.ts -L debug
