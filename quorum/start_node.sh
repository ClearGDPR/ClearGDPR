#!/bin/bash

#
# This is used at Container start up to run the constellation and geth nodes
#

set -u
set -e

### Configuration Options
TMCONF=/qdata/tm.conf

if [ "$SERVICE" = "constellation" ]; then
  echo "[*] Setup configuration for Constellation"

  # creating constellation config
  [ ! -f "/qdata/"$TMCONF ] || rm "/qdata/"$TMCONF
  cat /templates/tm.conf \
      | sed s/_NODEIP_/${NODE_IP}/g \
      | sed s/_NODE_CONSTELLATION_PORT_/${NODE_PORT}/g \
      | sed s%_NODELIST_%$OTHER_NODE_URLS%g \
            > /qdata/tm.conf

  if [ -d /qdata/keys ]; then
    rm -rf /qdata/keys
  fi

  # creating constellation public/private keys
  mkdir -p /qdata/keys
  echo $NODE_PUBLIC_KEY           | base64 --decode --ignore-garbage > "/qdata/keys/tm.pub"
  echo $NODE_PRIVATE_KEY          | base64 --decode --ignore-garbage > "/qdata/keys/tm.key"

  echo "[*] Starting Constellation node"
  /usr/local/bin/constellation-node $TMCONF
elif [ "$SERVICE" = "geth" ]; then
  echo "[*] Setup configuration for Geth"
  if [ ! -d /qdata/dd/keystore ]; then
    mkdir -p /qdata/dd/keystore
  fi

  if [ ! -f "/qdata/dd/nodekey" ]; then
    echo $NODE_KEY > "/qdata/dd/nodekey"
  fi

  # adding static-nodes.json
  [ ! -f "/qdata/dd/static-nodes.json" ] || rm "/qdata/dd/static-nodes.json"
  echo $STATIC_NODES_PROCESSOR | base64 --decode --ignore-garbage > "/qdata/dd/static-nodes.json"

  # adding the account private key (password protected)
  [ ! -f "/qdata/dd/keystore/"$KEYSTORE_FILE_NAME ] || rm "/qdata/dd/keystore/"$KEYSTORE_FILE_NAME
  echo $KEYSTORE_FILE | base64 --decode --ignore-garbage > "/qdata/dd/keystore/"$KEYSTORE_FILE_NAME

  if [ ! -f "/qdata/genesis.json" ]; then
    echo $GENESIS_JSON | base64 --decode --ignore-garbage > "/qdata/genesis.json"
  fi

  # adding password file for accounts (for the above private key)
  [ ! -f "/qdata/passwords.txt" ] || rm "/qdata/passwords.txt"
  echo $ACCOUNT_PASSWORD > "/qdata/passwords.txt"
  
  until curl -s --unix-socket /qdata/tm.ipc a; do
      echo 'Waiting for constellation'
      sleep 5
  done
  sleep 1;

  if [ ! -d /qdata/dd/geth/chaindata ]; then
    echo "[*] Mining Genesis block"
    /usr/local/bin/geth --datadir /qdata/dd init /qdata/genesis.json
  fi

  GETH_ARGS="--datadir /qdata/dd --raft --rpc --rpcaddr 0.0.0.0 --port "$ETH_PORT" --ws --wsorigins="*" --wsaddr 0.0.0.0 --wsport "$WEBSOCKET_PORT" --rpcport "$RPC_PORT" --raftport "$RAFT_PORT" --wsapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,raft --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,raft --nodiscover --unlock 0 --password /qdata/passwords.txt"

  # sleep 10 # fixed with a healthcheck on constellation (https://docs.docker.com/compose/compose-file/compose-file-v2/#healthcheck)
  echo "[*] Starting Geth node"
  PRIVATE_CONFIG=$TMCONF /usr/local/bin/geth $GETH_ARGS
else
  echo "Unsupported service, please set the SERVICE environment variable"
fi
