<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [INITIAL NOTES](#initial-notes)
- [USEFUL COMMANDS](#useful-commands)
- [IMPORTANT NOTE](#important-note)
- [COMMON ISSUES](#common-issues)
- [IF NOTHING WORKS](#if-nothing-works)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## INITIAL NOTES

Before starting to troubleshoot, make sure you **followed carefully** the steps in the [Quick Start guide](README.md).
Also, have [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/install/) properly installed in your environment. This project is built with container technology, and relies on Docker to run. It's recommended to have a good understanding about [containers](https://docs.docker.com/get-started/part2/), [services](https://docs.docker.com/get-started/part3/), [volumes](https://docs.docker.com/storage/volumes/) and [networks](https://docs.docker.com/network/) in a Docker context to be able to comprehend the project.

## USEFUL COMMANDS

* `docker-compose config --service`: To see the services currently running.
* `docker ps`: To see the containers currently running.
* `docker container ls --all`: To see all containers, both running and not running.
* `docker image ls --all`: To see all images.
* `docker network ls`: To see all networks, both running and not running.
* `docker volume ls`: To see all volumes.
* `docker inspect $CONTAINER_NAME`: Provide details on the container configuration, including the mounted volumes (See `Mounts` section).
* `docker exec -it $CONTAINER_NAME bash`: Get a shell (command line interface) in the container.
* `docker-compose exec $SERVICE_NAME bash`: Get a shell (command line interface) in a service's container.

Here's a [complete list of Docker commands](https://docs.docker.com/engine/reference/commandline/docker/#child-commands) and a [complete list of Docker-Compose commands](https://docs.docker.com/compose/reference/).

## IMPORTANT NOTE

Most issues are fixed by resetting the containers environment. In order to do that, remove the project's containers, images, volumes and networks with the following command:

* `docker-compose down -v --rmi`: Stops all running services, and also removes their containers, images, networks and volumes.

You can check if all containers, images, networks and volumes related to ClearGDPR were succesfully removed with these commands:

* `docker container ls --all`: To see all containers, both running and not running.
* `docker image ls --all`: To see all images.
* `docker network ls`: To see all networks, both running and not running.
* `docker volume ls`: To see all volumes.

If any of those was not removed properly, then try forcing the removal with the following commands:

* `docker container rm $CONTAINER_NAME --force`: Forcefully removes one or more containers.
* `docker image rm $IMAGE_NAME --force`: Forcefully removes one or more images.
* `docker network rm $NETWORK_NAME`: Removes one or more networks. There's no need to force the removal of networks. Note that there are 3 default networks that can't be removed.
* `docker volume rm $VOLUME_NAME --force`: Forcefully removes one or more volumes.

Or yet, forcefully remove all of them at once with:

* `docker container rm $(docker container ls --all --quiet) --force`: Forcefully removes all containers.
* `docker image rm $(docker image ls --all --quiet) --force`: Forcefully removes all images.
* `docker network rm $(docker network ls --quiet)`: Removes all networks. There's no need to forcefully remove networks.
* `docker volume rm $(docker volume ls --quiet) --force`: Forcefully removes all volumes.

After all containers, images, networks and volumes related to ClearGDPR were succesfully removed, reinitiate the system with:

* `docker/run`

The above command will pull all images and rebuild the containers, networks and volumes required for ClearGDPR.
If an error persists, proceed to the next section.

## COMMON ISSUES

**ERROR: Bad response from Docker engine**

If when trying to execute `docker/run` you get `ERROR: Bad response from Docker engine`

Try resetting to factory defaults in the Docker menu (settings).

**ERROR: No such file or directory**

Don't try to run the command `docker-compose up`, instead always run: `docker/run` from the project root directory. 

**Problems with dependencies**

If one or more dependencies are not found, try running `yarn install` in the root directory. 
If the issue persists, start the servers with `docker/run`, open another terminal tab/window and try running `docker exec $CONTAINER_NAME yarn install` inside the container that is showing the issue.

**ERROR: gyp ERR!**

Try running `yarn install` in the root directory. This is a dependecy issue.


**ERROR: An HTTP request took too long to complete**

Try running `docker-run` again. This error means building the system took too long.
You can also increase the building time for the system through the COMPOSE_HTTP_TIMEOUT environment variable. You can set the variable in your preferred terminal. If using bash:

`export COMPOSE_HTTP_TIMEOUT=300`

Or put that line in you terminal configuration file, which is `~/.bashrc` for a user's bash.

## IF NOTHING WORKS

Feel free to open an issue and reach out to us, we will try our best to help you :)
