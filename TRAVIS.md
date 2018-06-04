<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Configure Travis env](#configure-travis-env)
  - [Prerequisities](#prerequisities)
  - [Encrypting secrets](#encrypting-secrets)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Configure Travis env

## Prerequisities

1. Follow Travis CLI installation insctructions: https://github.com/travis-ci/travis.rb#installation
2. Login to Travis by running `travis login`
3. Make sure you have followed the Quick Start Guide to generate all `.env` files.

## Encrypting secrets

Then execute the following commands:

1. Compress secrets:
```bash
tar cvf secrets.tar cg/.env cg/.controller.env cg/.processor.env api/.env \
  quorum/node_1/.env quorum/node_2/.env \
  docker/definitions/postgres/.env \
  frontend/.env
```
2. Run:
```bash
travis encrypt-file secrets.tar --pro
```
3. Remove secrets.tar:
```bash
rm secrets.tar
```