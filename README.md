# ClearGDPR Platform [![Build Status](https://travis-ci.com/ClearGDPR/ClearGDPR.svg?branch=master)](https://travis-ci.com/ClearGDPR/ClearGDPR)

![Logo](logo.png)


## Introduction

ClearGDPR is a backend framework that allows web applications to comply with the new **General Data Protection Regulation - GDPR**. 

ClearGDPR focuses on data privacy, transparency, integrity and availability for the users of a web application, and applies Blockchain technology to achieve those at a high level.

ClearGDPR was built on top of Quorum, a Blockchain that extends Ethereum and is focused in privacy. In ClearGDPR, Blockchain technology is used as an immutable audit log.

ClearGDPR offers a front-end SDK and an HTTP API in order to allow your web application to manage personal user data according to the GDPR articles.

ClearGDPR can be implemented in 2 different ways:
- ElementSDK (set of ReactJS component - recommended - easiest).
- API (HTTP API). There's a Postman collection to facilitate the initial interaction with the HTTP API.

Finally, ClearGDPR is a containerized solution, applying Docker containers, images, services, volumes and networks.

# Table of contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Architecture](#architecture)
  - [Project structure](#project-structure)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
  - [Full Installation Setup](#full-installation-setup)
  - [Development Mode](#development-mode)
  - [Troubleshooting](#troubleshooting)
- [Integrations](#integrations)
  - [Element SDK](#element-sdk)
    - [Demo](#demo)
    - [Installation](#installation)
    - [Code Example](#code-example)
  - [API](#api)
    - [Example](#example)
    - [Documentation](#documentation)
      - [Website](#website)
      - [Postman Collections](#postman-collections)
- [Further reading](#further-reading)
- [Troubleshooting](#troubleshooting-1)
- [Roadmap](#roadmap)
- [License](#license)
- [Contributing](#contributing)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Architecture

![ClearGDPR Architecture](/docs/diagram.png)

## Project structure

```
project root
├─ lib
  ├─ api (cg)                 # Code for the ClearGDPR API implementation
  ├─ js-sdk                   # Code for the ClearGDPR JS SDK implementation
  └─ element-sdk              # Code for the ClearGDPR ElementSDK implementation
├─ ui
  └─ admin                    # Admin UI to manage the controller
├─ tools
  ├─ quorum                   # Blockchain related docker images and helper tools
  ├─ docker                   # Helpers for docker run, stop, start.
├─ demo
  ├─ back-end                 # demo back-end integrating ClearGDPR API
  └─ front-end                # demo front-end integrating ClearGDPR ElementSDK
├─ website                    # ClearGDPR public website
├─ travis                     # Scripts used on the CI server
```

# Requirements
- NodeJS v7.6+
- Docker
- Docker-compose

# Quick Start
The `docker-compose.yml` contains configuration for a reference development environment of one Data Controller and one Data Processor and all required dependencies.

## Full Installation Setup
The wizard will setup all the dependencies and demo website for you. Please follow the command line prompt.
```
node setup.js
``` 

Once the setup is done, you will have access to:
- http://localhost:3000 - Demo Website
- http://localhost:4000 - ClearGDPR Admin (pwd admin/clearGDPR)
- http://localhost:8082 - ClearGDPR API

## Development Mode
Docker is used for each part of the project, you can run all of them in watch (with nodemon) and development mode:
```
docker/run
```
Please make sure you ran `node setup` before.

# Integrations

## Element SDK

### Demo
Coming soon.

### Installation
Coming soon.

### Code Example
Coming soon.

## HTTP API
### Example
The API uses Bearer Authentication. Internally the API uses Jason Web Tokens - JWT, to generate and manage API tokens. Depending of the context (subject, processor or management), the token name can change.

```
curl -X GET \
  <ClearGDPR_API_URL>/api/subject/access-data \
  -H 'Authorization: Bearer <JWT>' \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json'
```

### Documentation
#### Website
Soon.
#### Postman Collections
- ClearGDPR API https://gist.github.com/Nelrohd/6c3e554ea0dcfea27784fa21dc5e4586
- Demo website (create/login user) https://gist.github.com/Nelrohd/e9d0bc833dd5cf4216eafd4b214e482e

# Further reading

Each part of the project has additional README documentation in its subfolder:
* [Quorum image and tools README](quorum/README.md)
* [ClearGDPR (CG) API README](cg/README.md)
* [Docker definitions README](docker/README.md)
* [Demo backend README](api/README.md)
* [Demo frontend README](frontend/README.md)
* [Updating Travis Configuration](TRAVIS.md)

# Roadmap

* ~~Development deploy~~  
* ~~HTTP API support for the right to consent and right to be forgotten(complete erasure)~~
* ~~All events related to user data are written to the blockchain~~
* ~~Quorum smart contract that stores the state of processors and controllers~~
* ~~Processor run mode and controller run mode, with events propagated between nodes through the blockchain smart contract~~
* ~~Example UI with registration/consent and erasure abilities~~
* ~~Encryption of all personal data on CG nodes~~
* ~~Robust integration test suite of CG nodes for both processor and controller mode~~
* ~~Admin dashboard design + front-end code (configuration, subject & processor status)~~
* ~~Automataic Quick Start script~~
* ~~Interactive Quick Start wizard~~
* ~~Admin dashboard hooked up to controller state via the CG api~~
* ~~HTTP API support for the remaining GDPR article actions/rights~~
* ~~More granular controls of consent/revoking of data (ie. which data can be shared specifically)~~
* Evolving functionalities, upgradability and security in the smart contract
* ~~End-2-End test suite of controller/processor interactions via blockchain~~
* Usage of Quorum’s custom privateFor method to whitelist nodes that are privy to specific events
* ~~SDK for implementing ClearGDPR from your frontend~~
* ~~Complete documentation~~
* Drop in wordpress plugin
* Commercial middleware plugin(s)
* Stage/Production deploy

# Troubleshooting

See the [Troubleshooting guide](TROUBLESHOOTING.md)

# License

This project is licensed under [GNU LGPL LICENSE](LICENSE)

# Contributing

See [Contributing](CONTRIBUTING.md) 
