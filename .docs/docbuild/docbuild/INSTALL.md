<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [MacOS](#macos)
- [Linux](#linux)
- [Windows](#windows)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## MacOS

> If you have installed Docker via `brew`, uninstall it via `brew uninstall docker`. Optionally, see the [Migrate from Boot2Docker](https://docs.docker.com/v1.8/installation/mac/) section.

1. Install the new [Docker for MAC](http://www.docker.com/products/docker#/mac).

To test if your configuration is correct, run `docker ps`. You should see something like:

```
$ docker ps
CONTAINER ID        IMAGE
```

2. You can adjust Docker resource usage clicking on the Docker icon -> Preferences -> Advanced.
3. Install [NodeJS LTS](https://nodejs.org/en/)
4. Install [Yarn](yarnpkg.com/en/docs/install)

## Linux

1. [Install](https://docs.docker.com/engine/installation/) Docker. You don't need `Docker Machine` on Linux.
2. [Allow](https://docs.docker.com/v1.4/installation/ubuntulinux/#giving-non-root-access) your non-root user to control `docker`.
3. [Install](https://docs.docker.com/compose/install/) Docker Compose.

To test if your configuration is correct, run `docker ps`. You should see something like:

```
$ docker ps
CONTAINER ID        IMAGE
```

4. Install [NodeJS LTS](https://nodejs.org/en/)
5. Install [Yarn](yarnpkg.com/en/docs/install)

## Windows

Windows is not supported. We strongly recommend to setup a development environment in a Linux virtual machine. You can use Vagrant or plain Virtualbox.
