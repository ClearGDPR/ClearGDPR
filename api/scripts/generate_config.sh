#!/bin/bash

set -e

uid=`id -u`
gid=`id -g`
pwd=`pwd`

image=clear-gdpr_api

target_dir=$pwd/api

docker run -u $uid:$gid -v $target_dir:/opt/app -v /opt/app/node_modules $image sh -c "node scripts/generate-config.js $1 $2"
