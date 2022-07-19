# mod-app-store

Copyright (C) 2022 Index Data Aps.

This software is distributed under the terms of the Apache License, Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

<!-- md2toc -l 2 README.md -->
* [Overview](#overview)
* [Invocation](#invocation)
* [Environment](#environment)
* [Configuration](#configuration)
* [Descriptors](#descriptors)
* [Docker build and run](#docker-build-and-run)
* [See also](#see-also)


## Overview

This module supplies a simple WSAPI on which we can build a prototype app-store for FOLIO. Most importantly, it provides lists of candidate apps from a configured set of GitHub repositories. In time, we will provide a WSAPI to maintain that configuration, but for now the static file is used.


## Invocation

`mod-app-store` is invoked using `babel-node` to interpret ES6 features in JavaScript. The only command-line argument is the name of a configuration file: see below. Use something like:

	babel-node --presets=env -- mod-app-store.js etc/example-config.json

The following command-line options are supported:

* `-p NUMBER` or `--port=NUMBER` -- Listen on the specified port instead of the default of 3002.
* `-V` or `--version` -- Display the version number and exit
* `-h` or `--help` -- Display a full list of options


## Environment

`mod-app-store` uses [categorical-logger](https://github.com/openlibraryenvironment/categorical-logger) for logging. It logs messages in the categories specified by a comma-separated list in the environment variable `LOGGING_CATEGORIES`, or if that is not defined `LOGCAT`.

The following logging categories are used:

* `config` -- logs the compiled configuration when it's parsed during startup.
* `listen` -- logs the listen port when the server becomes available to receive connections.
* `request` -- logs each incoming request's method and path, and the response code and message
* `error` -- logs errors that are sent back in HTTP 500 responses

For example, you might set the categories as follows:

	export LOGCAT=config,listen,request,error


## Configuration

The single configuration file named on the command line specifies which GitHub repositiories should be uses as sources of apps. By configuring this, system administrators can tailor which sets of apps are made available to their users. It can be thought of as analogous to the APT source list in Debian-based Linux distributions (`/etc/apt/sources.list`).

The file must be well-formed JSON consisting of a single array. Each entry in the array specifies a single GitHub source containing application metadata, such as https://github.com/MikeTaylor/example-folio-app-source. Each entry is a JSON object with the following elements:

* `owner` -- The owner of the repostitor, e.g. `MikeTaylor`.
* `repo` -- The name of the repository within the owner's area, e.g. `example-folio-app-source`.
* `token` -- [A GitHub personal token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) which can be used to access the repository via the GitHub API.
* `tokenStart` and `tokenEnd` -- If `token` is not provided, then the values of these two fields are concatenated and used as the token. This can be necessary when maintaining a configuration in git, as GitHub automatically revokes any token that it sees in files that are pushed to it.

The distribution includes [An example configuration file](etc/example-config.json).


## Descriptors

The descriptors needed for use in FOLIO (module descriptor, deployment descriptor, etc.) are generated from templates in [the `descriptors` directory](descriptors), and the expanded versions are placed in [the `target` directory](target) as with Java-based FOLIO modules.

To generate or regenerate the descriptors, use `yarn generate`.


## Docker build and run

In summary:
```sh
$ docker build -t mod-app-store .
Sending build context to Docker daemon  67.89MB
Step 1/11 : FROM node:16-alpine AS base
[...]
Successfully built ad5ee83ded0e
Successfully tagged mod-app-store:latest
$ docker run -dp 3002:3002 --name MAS mod-app-store
affad42ca413579d56f9115662496eb82591995c05540e7a36dc87f09b8b987b
e$ curl -w '\n' localhost:3002/admin/health
Behold! I live!!
$ docker ps
CONTAINER ID   IMAGE           COMMAND                  CREATED          STATUS          PORTS                                       NAMES
affad42ca413   mod-app-store   "docker-entrypoint.s…"   34 seconds ago   Up 33 seconds   0.0.0.0:3002->3002/tcp, :::3002->3002/tcp   MAS
$ docker stop MAS
MAS
```


## To run under an Okapi-mediate FOLIO in a Vagrant box

Start mod-app-store in the host box where you are developing:
```
shell1$ yarn start
yarn run v1.22.18
$ env LOGCAT=listen,request,error babel-node --presets=env,stage-2 -- mod-app-store.js etc/example-config.json
(listen) mod-app-store listening on port 3002
[...]
```

Set up an ssh tunnel, so that the virtual machine can see the running mod-app-store in the host:
```
shell2$ cd vagrant
shell2$ vagrant ssh -- -R 3002:localhost:3002
vagrant@vagrant:~$ 
[...]
```

Tell Okapi (via the existing tunnel) about the newly available module, and how to access it via the tunnel, and to associate it with the tenant Diku:
```
shell3$ curl -w '\n' -d @target/ModuleDescriptor.json http://localhost:9130/_/proxy/modules
shell3$ curl -w '\n' -d @target/Discovery.json http://localhost:9130/_/discovery/modules
shell3$ curl -w '\n' -d @target/Activate.json http://localhost:9130/_/proxy/tenants/diku/modules
```

## See also

* [The MAFIA project](https://github.com/MikeTaylor/mafia), of which this is a part.
* [The FAM (FOLIO Application Metadata) file format](https://github.com/MikeTaylor/mafia/blob/master/doc/folio-app-metadata.md).
* [Informal register of issues](TODO.md).

