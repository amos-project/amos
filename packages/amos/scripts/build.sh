#!/usr/bin/env bash
# @since 2022-03-07 15:26:59
# @author junbao <junbao@moego.pet>

rm -rf {lib,react,redux}/*.{js,map}

yarn tsc --module commonjs

