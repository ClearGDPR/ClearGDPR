# ClearGDPR Platform [![Build Status](https://travis-ci.com/ClearGDPR/ClearGDPR.svg?branch=master)](https://travis-ci.com/ClearGDPR/ClearGDPR)

![Logo](logo.png)

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

## Overview

Regardless of your data stores, ClearGDPR allows you to install on-premise or in the cloud, a complete web based GDPR compliance tool, with Blockchain anchored chain-of-custody records.

This repository contains implementation of the ClearGDPR platform as well as an example UI for the data subjects to demonstrate how developers can integrate with the ClearGDPR APIs and have a drop-in style compliance enabled for their project.

# Table of contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Architecture](#architecture)
  - [Project structure](#project-structure)
- [Quick Start guide](#quick-start-guide)
- [Further reading](#further-reading)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [License](#license)
- [Contributing](#contributing)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Architecture

![ClearGDPR Architecture](/docs/diagram.png)

## Project structure

The project is split into multiple services, each contained within it's own directory:

```
project root
├─ quorum                           # Blockchain related docker images and helper tools
├─ cg                               # Code for the ClearGDPR API implementation
├─ frontend                         # Example React UI to interact with ClearGDPR API
├─ api                              # Example back-end React UI to interact with ClearGDPR API
├─ docs                             # Documentation artifacts (images, documents, etc.)
└─ travis                           # Scripts used on the CI server
```

# Quick Start guide

The `docker-compose.yml` contains configuration for a reference development environment of one Data Controller and one Data Processor and all required dependencies.

To get started with the project the only pre-reqs are node (v7.6+), docker and docker-compose.

Our interactive quick start will get you up and running, simply run `node setup.js` from the root of the project and follow the prompts. 

If you have issues getting up and running, be sure to check out our [troubleshooting guide](TROUBLESHOOTING.md). 

# Further reading

Each part of the project has additional README documentation in its subfolder:
* [Quorum image and tools README](quorum/README.md)
* [ClearGDPR (CG) API README](cg/README.md)
* [Docker definitions README](docker/README.md)
* [Demo backend README](api/README.md)
* [Demo frontend README](frontend/README.md)
* [Updating Travis Configuration](TRAVIS.md)

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
* Automate Quick Start script
* Interactive Quick Start wizard
* Admin dashboard hooked up to controller state via the CG api
* Adding the remaining GDPR article actions/rights
* More granular controls of consent/revoking of data (ie. which data can be shared specifically)
* Evolving functionalities, upgradability and security in the smart contract
* E2E test suite of controller/processor interaction via blockchain
* Usage of Quorum’s custom privateFor method for whitelisting of nodes that are privy to specific events
* Fleshing out an SDK for implementing CG interaction from your frontend
* Drop in wordpress plugin
* Commercial middleware plugin(s)

# License

This project is licensed under [GNU LGPL LICENSE](LICENSE)

# Contributing

See [Contributing](CONTRIBUTING.md) 
