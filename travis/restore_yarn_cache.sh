#!/bin/bash

SERVICES_DIR=(cg admin api frontend)
CACHE_DIR=$HOME/.yarn_cache

if [ ! -d $CACHE_DIR ]; then
    mkdir -p $CACHE_DIR
fi

echo "Preparing yarn cache"
for i in "${!SERVICES_DIR[@]}"
do
  SERVICE_DIR=${SERVICES_DIR[$i]}
  SERVICE_CACHE_FILE=$CACHE_DIR/.$SERVICE_DIR-yarn-cache.tgz
  if [ ! -f $SERVICE_CACHE_FILE ]; then
    continue
  fi
  echo "Copying $CACHE_DIR/.$SERVICE_DIR-yarn-cache.tgz to $SERVICE_DIR/.yarn-cache.tgz"
  cp $CACHE_DIR/.$SERVICE_DIR-yarn-cache.tgz $SERVICE_DIR/.yarn-cache.tgz
done