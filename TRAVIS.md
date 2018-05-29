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
travis encrypt-file secrets.tar
```
3. Remove secrets.tar:
```bash
rm secrets.tar
```