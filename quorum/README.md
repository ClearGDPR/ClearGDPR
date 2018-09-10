<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [A brief introduction to the Quorum architecture](#a-brief-introduction-to-the-quorum-architecture)
- [Interacting with the Quorum nodes](#interacting-with-the-quorum-nodes)
  - [Opening bash shells in the Geth and Constellation containers](#opening-bash-shells-in-the-geth-and-constellation-containers)
  - [Opening a JavaScript interactive console in the Geth nodes](#opening-a-javascript-interactive-console-in-the-geth-nodes)
- [Configuration for the Quorum nodes](#configuration-for-the-quorum-nodes)
  - [Setting up the environment](#setting-up-the-environment)
  - [Helper commands (used internally)](#helper-commands-used-internally)
    - [Creating a Quorum node](#creating-a-quorum-node)
    - [Generating environment for a Quorum node](#generating-environment-for-a-quorum-node)
  - [Generating complete configurations (node + environment) for Quorum nodes](#generating-complete-configurations-node--environment-for-quorum-nodes)
  - [Getting account private key](#getting-account-private-key)
  - [Resetting the blockchain](#resetting-the-blockchain)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# A brief introduction to the Quorum architecture

Each Quorum node is composed of a Geth node and a Contellation node. The Geth node is an Ethereum node implemented in Go and slightly modified in Quorum to support privacy features. The Constellation node is a message broker/manager that encrypts and routes messages to other Constellation nodes. The Constellation node is itself composed of the transaction manager, which routes the transactions to its proper recipients, and the Enclave, responsible for holding cryptographic keys and encrypting the transactions. 
So the Quorum architecture in ClearGDPR looks like this:

  - Quorum node
    - Geth node
    - Constellation node
      - Transaction manager
      - Enclave

# Interacting with the Quorum nodes

## Opening bash shells in the Geth and Constellation containers 

Both the Geth node and the Constellation node run inside their own Docker containers. It is possible to interact with the Geth and Constellation containers by opening a bash shell in them:

```bash
docker-compose exec geth1 bash
```

Switch ```geth1``` for ```constellation1``` to open a bash in the constellation container instead.
Inside a Geth or Constellation shell, it's possible to see which files are on the container. Remembering that these containers are Ubuntu 16.04 Linux with only the dependencies required for Geth or Constellation to run in them. 
In particular, the directories ```/scripts``` and ```/qdata``` are important, as they contain the changes made on top of the basic Ubuntu 16.04 filesystem. You should take a look around these directories to get familiarized with them.

## Opening a JavaScript interactive console in the Geth nodes

Furthermore, you can open an interactive JS console in a Geth node with the command bellow if you are already inside a Geth's bash:

```bash
geth attach ws://quorum1:8546
``` 

The command above opens a JS interactive console in Quorum node 1 via a websocket port.
Or if you are not inside a Geth's bash:

```bash
docker-compose exec geth1 geth attach ws://quorum1:8546
```

When inside the JS interactive console, you should see the management Application Programming Interfaces - APIs, available:

  - admin
  - db
  - eth
  - debug
  - miner 
  - net
  - shh
  - txpool
  - personal
  - web3
  - raft

All of the management APIs are set to be available in ClearGDPR. 
More information on the management APIs, except raft which is Quorum only, can be found in the [Ethereum's Github repo wiki](https://github.com/ethereum/go-ethereum/wiki/Management-APIs). About the raft API, more can be found in the [Quorum's Github repo docs](https://github.com/jpmorganchase/quorum/blob/master/raft/doc.md).

# Configuration for the Quorum nodes

[![Build Status](https://travis-ci.org/ClearGDPR/ClearGDPR.svg?branch=master)](https://travis-ci.org/ClearGDPR/ClearGDPR)

ClearGDPR's Quorum nodes are containerized with Docker containers. 
The Quorum node Docker containers were based on this project:
https://github.com/ConsenSys/quorum-docker-Nnodes/pull/5/files

## Setting up the environment

In the root directory, run:

```bash
node setup.js
```
As mentioned in the Quick Start guide, this will set a development environment for you.

## Helper commands (used internally)

Usage is described when running the scripts without parameters:

### Creating a Quorum node
```bash
$ quorum/scripts/create_node.sh
Usage of the command:
quorum/scripts/create_node.sh target_directory constallation_ip geth_ip constellation_port eth_port raft_port rpc_port websocket_port [password]
   target_directory: subdir under quorum/generated_configs/
   password: password used to lock / unlock the geth account (optional)
```

### Generating environment for a Quorum node
```bash
$ quorum/scripts/generate_env_vars.sh
Usage of the command:
    quorum/scripts/generate_env_vars.sh target_directory [[target_directory2] ...]

Example:
    quorum/scripts/generate_env_vars.sh node1 node2
```

## Generating complete configurations (node + environment) for Quorum nodes

Example commands to generate configs for 2 nodes for AWS/Kubernetes deploy:

```bash
quorum/scripts/create_node.sh node1 127.0.0.1 127.0.0.1 9000 30303 50400 8545 8546 p@sw0rd1 && \
  quorum/scripts/create_node.sh node2 127.0.0.1 127.0.0.1 9001 30304 50401 8547 8548 p@sw0rd1 && \
  quorum/scripts/generate_env_vars.sh node1 node2
```

Example commands to generate configs for 2 nodes for local docker-compose:

```bash
quorum/scripts/create_node.sh node1 172.13.0.2 172.13.0.4 9000 30303 50400 8545 8546 p@sw0rd1 && \
  quorum/scripts/create_node.sh node2 172.13.0.3 172.13.0.5 9000 30303 50400 8545 8546 p@sw0rd1 && \
  quorum/scripts/generate_env_vars.sh node1 node2
```

## Getting account private key

You can use the command below to get the private key of a node:

```bash
docker-compose exec geth1 /bin/sh -c "cat /qdata/dd/keystore/*"
```

Save the output to a file in `cg/` subdirector, ex. `cg/test-key.temp.json`, and then run:

```bash
docker-compose exec cg node scripts/get-wallet-pk.js test-key.temp.json [PASSWORD FROM .env - default is empty]
```

Then remove the key file.

## Resetting the blockchain

Run:

```bash
docker-compose down -v
```