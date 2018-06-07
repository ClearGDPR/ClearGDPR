#!/bin/bash

SERVICES_DIR=(cg api frontend)
CACHE_DIR=$HOME/.yarn_cache

if [ ! -d $CACHE_DIR ]; then
    mkdir -p $CACHE_DIR
fi

echo "Preparing yarn cache"
for i in "${!SERVICES_DIR[@]}"
do
  SERVICE_DIR=${SERVICES_DIR[$i]}
  echo "Copying $SERVICE_DIR/.yarn-cache.tgz to $CACHE_DIR/.$SERVICE_DIR-yarn-cache.tgz"
  cp $SERVICE_DIR/.yarn-cache.tgz $CACHE_DIR/.$SERVICE_DIR-yarn-cache.tgz
done