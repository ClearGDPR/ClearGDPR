## INITIAL NOTES

Before starting to troubleshoot, make sure you **followed carefully** the steps in [Quick Start guide](README.md).
Also, have [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/install/) properly installed in your environment. This project is built with container technology, and relies on Docker to run. It's recommended to have a good understanding about [containers](https://docs.docker.com/get-started/part2/), [services](https://docs.docker.com/get-started/part3/), [volumes](https://docs.docker.com/storage/volumes/) and [networks](https://docs.docker.com/network/) in a Docker context to be able to comprehend the project.

## USEFUL COMMANDS

* `docker-compose ps`: To see the services currently running.
* `docker ps`: To see the containers currently running.
* `docker container ls`: To see all containers, both running and not running.
* `docker image ls`: To see all images.
* `docker network ls`: To see all networks, both running and not running.
* `docker volume ls`: To see all volumes.
* `docker inspect $CONTAINER_NAME`: Provide details on the container configuration, including the mounted volumes (See `Mounts` section).
* `docker exec -it $CONTAINER_NAME bash`: Get a shell (command line interface) in the container.

Here's a [complete list of Docker commands](https://docs.docker.com/engine/reference/commandline/docker/#child-commands).

## IMPORTANT NOTE

Most issues are fixed by resetting the containers environment. In order to do that, remove the project's containers, images, volumes and networks with the following command:

* `docker-compose down -v --rmi all`: Stops all running services, and also removes their containers, images, networks and volumes.

In some cases there's need to forcefully remove the images and volumes, when those are shared for example.
You can check if all containers, images, networks and volumes were succesfully removed with these commands:

* `docker container ls`: To see all containers, both running and not running.
* `docker image ls`: To see all images.
* `docker network ls`: To see all networks, both running and not running.
* `docker volume ls`: To see all volumes.

If any of those was not removed properly, then try forcing the removal with the following commands:

* `docker container rm $CONTAINER_NAME --force`: Forcefully removes one or more containers.
* `docker image rm $IMAGE_NAME --force`: Forcefully removes one or more images.
* `docker network rm $NETWORK_NAME`: Removes one or more networks. There's no need to force the removal of networks. Note that there are 3 default networks that can't be removed.
* `docker volume rm $VOLUME_NAME --force`: Forcefully removes one or more volumes.

Or remove all dangling Docker artifacts with:

* `docker container rm $(docker container ls --all --quiet --filter "status=exited")`: Removes exited Docker containers.
* `docker image rm $(docker image ls --all --quiet --filter "dangling=true")`: Removes all dangling images.
* `docker volume rm $(docker volume ls --quiet --filter "dangling=true")`: Removes all dangling volumes.

Or yet, forcefully remove all of them at once with:

* `docker container rm $(docker container ls --all --quiet) --force`: Forcefully removes all containers.
* `docker image rm $(docker image ls --all --quiet) --force`: Forcefully removes all images.
* `docker network rm $(docker network ls --quiet)`: Removes all networks. There's no need to forcefully remove networks.
* `docker volume rm $(docker volume ls --quiet) --force`: Forcefully removes all volumes.

After all containers, images, networks and volumes related to the project were succesfully removed, reinitiate the system with:

* `docker/run`

If an error persists, proceed to the next section.

## COMMON ISSUES

**ERROR: Bad response from Docker engine**

If when trying to execute `docker/run` you get `ERROR: Bad response from Docker engine`

Resetting to factory defaults in the docker menu (settings) fixed the issue.

**ERROR: No such file or directory**

Don't try to run the command `docker-compose up`, instead always run: `docker/run` from the project root directory.

**Docker-compose not working properly**

If your Docker-compose is not finding a running service or not executing a command properly, then try prepending the following into your docker-compose command:

`COMPOSE_PROJECT_NAME=clear-gdpr`

Example docker-compose command with the above prepended:

`COMPOSE_PROJECT_NAME=clear-gdpr docker-compose ps`

This specifies the current target project for Docker-compose.

If the error persists, try changing the version of your Docker-compose. 

**Problems with dependencies**

Make sure you ran `yarn install` in the root directory. 
If the issue persists, start the servers with `docker/run` and then try running `docker exec $CONTAINER_NAME yarn install` inside the container that is showing the issue. 

**ERROR: Couldn't find env file**

Copy the .env.example files into .env files in the following drectories: /api, /og, /quorum/node_1, /quorum/node_2. 
Note that there are 3 .env.example files in /og, copy all of them with the same name, removing the .example in the end.

**ERROR: An HTTP request took too long to complete**

Simply try tunning `docker-run` again. This error means building the system took too long.

## IF NOTHING WORKS

Feel free to open an issue and reach out to us, we will try our best to help you :)
