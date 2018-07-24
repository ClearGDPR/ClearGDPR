<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [ClearGDPR Admin](#cleargdpr-admin)
  - [Install](#install)
  - [Build](#build)
  - [Default admin](#default-admin)
  - [Run tests](#run-tests)
    - [Run inside docker](#run-inside-docker)
    - [Run locally in watch mode](#run-locally-in-watch-mode)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# ClearGDPR Admin 

Management for CG instance 

## Install

```
yarn install
yarn start
```

## Build

```bash
make -C admin dist
```

## Default admin

Default admin credentials are admin/clearGDPR

## Run tests

### Run inside docker

```bash
docker/compose exec admin yarn test
```

### Run locally in watch mode

```bash
yarn run test:watch
```