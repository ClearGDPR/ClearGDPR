## Caching

There are several caching mechanism. They are essential to achieve faster build and execution times.

### Docker cache

Docker caching is achieved by careful orderding and grouping of statements in container definitions (`Dockerfile`).
Docker caching works by caching each step in the Dockerfile; if the step does not change, the cached version is used.
We try here to design the Dockerfiles in order to minimize cache invalidations: for example, we add the code at the very end of the build process (since the code changes frequently).

When you first run `docker/run`, the build can take some time (2-10 minutes depending on your computer and your Internet connection). Starting from second run, the build is going to take a lot less, as Docker caching starts to be effective. You're going to see a lot of lines like:

```
Step 2 : ENV TZ America/New_York
 ---> Using cache
 ---> 8f46e6131fa8
```

(notice the `Using cache`).

### Yarn caching

The most demanding build step of a node.js container is running `yarn`. Depending on your `package.json`, this step can take a lot of time (up to 5 minutes in some cases). We save the yarn cache over successive builds (we store it in a file called `.yarn-cache.tgz`). In order to get consistent installs across machines, Yarn needs more information than the dependencies you configure in your `package.json`. Yarn needs to store exactly which versions of each dependency were installed. This information is stored in the `yarn.lock` file. It is important to check this into source-control. [Documentation](https://yarnpkg.com/en/docs/yarn-lock)
