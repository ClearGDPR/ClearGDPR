# ClearGDPR Platform

version 0.0.1

## Overview

Regardless of your data stores, ClearGDPR allows you to install on-premise or in the cloud, a complete web based GDPR compliance tool, with Blockchain anchored chain-of-custody records.

This repository contains implementation of the ClearGDPR platform as well as an example UI for the data subjects to demonstrate how developers can integrate with the ClearGDPR APIs and have a drop-in style compliance enabled for their project.

# Table of contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

* [Architecture](#architecture)
  * [Project structure](#project-structure)
* [Quick Start guide](#quick-start-guide)
* [Further reading](#further-reading)
* [Troubleshooting](#troubleshooting)
* [Roadmap](#roadmap)
* [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Architecture

![ClearGDPR Architecture](/docs/diagram.png)

## Project structure

The project is split into multiple services, each contained within it's own directory:

```
project root
├─ quorum                           # Blockchain related docker images and helper tools
├─ og                               # Code for the ClearGDPR API implementation
├─ frontend                         # Example React UI to interact with ClearGDPR API
├─ api                              # Example back-end React UI to interact with ClearGDPR API
└─ docs                             # Documentation artifacts (images, documents, etc.)
```

# Quick Start guide

The `docker-compose.yml` contains configuration for a reference development environment of one Data Controller and one Data Processor and all required dependencies.

In order to run and test this environment follow the instructions below"

1. Follow the [Installation guide](INSTALL.md) for required dependencies
2. Invent a password to be used with your quorum node account secrets. Set it as environment variable by executing this in your terminal:

```bash
ACCOUNT_PASS=super_secret_psw
```

This variable will be used in the remainder of the setup in the Quick Start guide.

3. Create empty .env files:

```bash
touch cg/.env cg/.controller.env cg/.processor.env api/.env \
  quorum/node_1/.env quorum/node_2/.env \
  docker/definitions/postgres/.env \
  && cp frontend/.env.example frontend/.env
```

4. Build the docker images:

```
docker/run --build
```

5. Generate environment configuration for Quorum nodes:

```bash
quorum/scripts/create_node.sh node1 172.13.0.2 172.13.0.4 9000 30303 50400 8545 8546 $ACCOUNT_PASS && \
  quorum/scripts/create_node.sh node2 172.13.0.3 172.13.0.5 9000 30303 50400 8545 8546 $ACCOUNT_PASS && \
  quorum/scripts/generate_env_vars.sh node1 node2
```

TODO: get wallet private key for tests

6. Copy generated .env files to the right directories:

```bash
cp quorum/generated_configs/node1/.env quorum/node_1/.env && \
  cp quorum/generated_configs/node2/.env quorum/node_2/.env
```

7. Store node addresses as environment variables:

```bash
CONTROLLER_ACCOUNT=0x$(cat quorum/generated_configs/node1/dd/account.txt) && \
  PROCESSOR_ACCOUNT=0x$(cat quorum/generated_configs/node2/dd/account.txt)
```

8. Define password for Postgres service and databases as environment variable:

```bash
DB_PASSWORD=super_secret_psw
```

8. Generate configs for the `cg` service:

```bash
SUBJECTS_SECRET="$(cg/scripts/generate_config.sh $CONTROLLER_ACCOUNT $PROCESSOR_ACCOUNT $ACCOUNT_PASS $DB_PASSWORD)"
```

This will also set the `SUBJECTS_SECRET` environment variable so it can be added to `api` service `.env` file in the next step.

9. Generate configs for the `api` service:

```bash
api/scripts/generate_config.sh $DB_PASSWORD $SUBJECTS_SECRET
```

10. Create `.env` file for `postgres` service with DB password:

```
echo "POSTGRES_PASSWORD=$DB_PASSWORD" > docker/definitions/postgres/.env
```

11. Run: `docker/run`
12. Open up a new terminal tab / window
13. Deploy the smart contract:

```bash
COMPOSE_PROJECT_NAME=clear-gdpr docker-compose exec cg yarn run deploy-contract
```

14. Create an example processor

```
PROCESSOR_ACCOUNT=0x$(cat quorum/generated_configs/node2/dd/account.txt) && \
  COMPOSE_PROJECT_NAME=clear-gdpr docker-compose exec cg yarn run add-processor $PROCESSOR_ACCOUNT
```

Later you can change the data of the processor using the [management API](cg/docs/CG_API.md).

# Further reading

Each part of the project has additional README documentation in its subfolder:
* [Quorum image and tools README](quorum/README.md)
* [ClearGDPR (CG) API README](cg/README.md)
* [Docker definitions README](docker/README.md)
* [Demo backend README](api/README.md)
* [Demo frontend README](frontend/README.md)

# Troubleshooting

See the [Troubleshooting guide](TROUBLESHOOTING.md)

# Roadmap

* ~~CG API supports giving consent and revoking consent(erasure)~~
* ~~All events are written to the blockchain~~
* ~~Quorum smart contract that stores client state of processors and controllers~~
* ~~Processor mode and controller mode is working, with events propagated between nodes through the blockchain smart contract~~
* ~~A example UI with registration/consent and erasure abilities~~
* ~~Encryption of all data on CG nodes~~
* ~~Robust integration test suite of CG nodes for both processor and controller mode~~
* ~~Admin dashboard design + front-end code (configuration, subject & processor status)~~
* Automated Quick Start
* Admin dashboard hooked up to controller state via the CG api
* Adding the remaining GDPR article actions/rights
* More granular controls of consent/revoking of data (ie. which data can be shared specifically)
* Evolving functionalities, upgradability and security in the smart contract
* E2E test suite of controller/processor interaction via blockchain
* Usage of Quorum’s custom privateFor method for whitelisting of nodes that are privy to specific events
* Fleshing out an SDK for implementing CG interaction from your frontend

# License

This project is licensed under [GNU LGPL LICENSE](LICENSE)
