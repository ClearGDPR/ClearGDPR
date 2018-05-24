#!/bin/bash

set -e

pwd=`pwd`

if [ "$1" = "" ] ; then
    echo "Usage of the command:"
    echo "    quorum/scripts/generate_env_vars.sh target_directory [[target_directory2] ...]"
    echo ""
    echo "Example:"
    echo "    quorum/scripts/generate_env_vars.sh node1 node2"
    exit 1
fi

GENESIS_JSON=`node "$pwd/quorum/scripts/generate_genesis.js" $@`
STATIC_NODES=`node "$pwd/quorum/scripts/generate_static_nodes.js" $@`

for i in "${@:1}"
do
    target_dir=$pwd'/quorum/generated_configs'/$i
    target_env=$target_dir/.env

    OTHER_NODE_URLS=`node "$pwd/quorum/scripts/generate_other_nodes.js" $i $@`
    
    # replacing new lines for base64 implementations that add them
    NODE_PUBLIC_KEY=`base64 -i $target_dir/keys/tm.pub | tr -d "\n"`
    NODE_PRIVATE_KEY=`base64 -i $target_dir/keys/tm.key | tr -d "\n"`

    NODE_KEY=`cat $target_dir/nodekey`
    KEYSTORE_FILE_NAME=`ls $target_dir/dd/keystore | head -n 1`
    KEYSTORE_FILE=`base64 -i $target_dir/dd/keystore/$KEYSTORE_FILE_NAME | tr -d "\n"`

    touch $target_env

    cat $target_dir/.env.start > $target_env
    echo "OTHER_NODE_URLS=$OTHER_NODE_URLS" >> $target_env
    echo "" >> $target_env
    echo "NODE_PUBLIC_KEY=$NODE_PUBLIC_KEY" >> $target_env
    echo "NODE_PRIVATE_KEY=$NODE_PRIVATE_KEY" >> $target_env
    echo "" >> $target_env
    echo "NODE_KEY=$NODE_KEY" >> $target_env
    echo "" >> $target_env
    echo "KEYSTORE_FILE_NAME=$KEYSTORE_FILE_NAME" >> $target_env
    echo "" >> $target_env
    echo "KEYSTORE_FILE=$KEYSTORE_FILE" >> $target_env
    echo "" >> $target_env
    echo "GENESIS_JSON=$GENESIS_JSON" >> $target_env
    echo "" >> $target_env
    echo "STATIC_NODES=$STATIC_NODES" >> $target_env
    
    echo ".env for $i generated in $target_dir/.env"
done