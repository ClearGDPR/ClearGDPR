<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [CG Quorum – The docker image and configuration for Quorum Docker containers](#cg-quorum--the-docker-image-and-configuration-for-quorum-docker-containers)
  - [Setting up the environment](#setting-up-the-environment)
  - [Helper commands (used internally)](#helper-commands-used-internally)
    - [Creating a Quorum node](#creating-a-quorum-node)
    - [Generating environment for a Quorum node](#generating-environment-for-a-quorum-node)
  - [Generating complete configurations for Quorum nodes](#generating-complete-configurations-for-quorum-nodes)
  - [Getting account private key:](#getting-account-private-key)
  - [Resetting the blockchain](#resetting-the-blockchain)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# CG Quorum – The docker image and configuration for Quorum Docker containers

[![Build Status](https://travis-ci.org/ClearGDPR/ClearGDPR.svg?branch=master)](https://travis-ci.org/ClearGDPR/ClearGDPR)

ClearGDPR's Quorum containerized nodes  were based on this project: https://github.com/ConsenSys/quorum-docker-Nnodes/pull/5/files

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

## Generating complete configurations for Quorum nodes

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
