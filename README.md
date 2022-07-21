# mod-app-manager

Copyright (C) 2022 Index Data Aps.

This software is distributed under the terms of the Apache License, Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

<!-- md2toc -l 2 README.md -->
* [Overview](#overview)
* [Invocation](#invocation)
* [Environment](#environment)
    * [`OKAPI_URL`](#okapi_url)
    * [`LOGGING_CATEGORIES`/`LOGCAT`](#logging_categorieslogcat)
* [Configuration](#configuration)
* [Descriptors](#descriptors)
* [Docker build and run](#docker-build-and-run)
* [To run under an Okapi-mediated FOLIO in a Vagrant box](#to-run-under-an-okapi-mediated-folio-in-a-vagrant-box)
* [See also](#see-also)


## Overview

This module supplies a simple WSAPI on which we can build a prototype Application Manager for FOLIO. Most importantly, it provides lists of candidate apps from a configured set of GitHub repositories. In time, we will provide a WSAPI to maintain that configuration, but for now the static file is used.


## Invocation

`mod-app-manager` is invoked using `babel-node` to interpret ES6 features in JavaScript. The only command-line argument is the name of a configuration file: see below. Use something like:

	babel-node --presets=env -- mod-app-manager.js etc/example-config.json

The following command-line options are supported:

* `-p NUMBER` or `--port=NUMBER` -- Listen on the specified port instead of the default of 3002.
* `-V` or `--version` -- Display the version number and exit
* `-h` or `--help` -- Display a full list of options


## Environment

### `OKAPI_URL`

`mod-app-manager` stores this dynamic configuration of which GitHub sources to use in `mod-configuration`. Calls made to Okapi for this purpose are sent to Okapi that made the request, if any (using the `X-Okapi-URL` header of the incoming request), or the default URL specified in the static configuration otherwise (i.e. when used in standalone mode, not mediated by Okapi). However, if the `OKAPI_URL` environment variable is set, then this is used instead, overriding both other sources of this information.

(Why is this useful? Consider a development setup when you are side-loading `mod-app-manager` by running it in a host system, with an SSH tunnel through to a FOLIO server running in a guest machine. When requests come from that server's Okapi, the service URL as known to that Okapi is one that's private to the guest OS, such as `http://10.0.2.15:9130`, so `mod-app-manager` in the host machine can't reach it. The `OKAPI_URL` provides a way to specify an address that works from the host machine, such as `http://localhost:9130` which is typically tunnelled into the guest VM.)

### `LOGGING_CATEGORIES`/`LOGCAT`

`mod-app-manager` uses [categorical-logger](https://github.com/openlibraryenvironment/categorical-logger) for logging. It logs messages in the categories specified by a comma-separated list in the environment variable `LOGGING_CATEGORIES`, or if that is not defined `LOGCAT`.

The following logging categories are used:

* `config` -- logs the compiled configuration when it's parsed during startup.
* `listen` -- logs the listen port when the server becomes available to receive connections.
* `request` -- logs each incoming request's method and path, and the response code and message
* `error` -- logs errors that are sent back in HTTP 500 responses

For example, you might set the categories as follows:

	export LOGCAT=config,listen,request,error


## Configuration

**XXX this whole section is outdated and needs rewriting**

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
$ docker build -t mod-app-manager .
Sending build context to Docker daemon  67.89MB
Step 1/11 : FROM node:16-alpine AS base
[...]
Successfully built ad5ee83ded0e
Successfully tagged mod-app-manager:latest
$ docker run -dp 3002:3002 --name MAS mod-app-manager
affad42ca413579d56f9115662496eb82591995c05540e7a36dc87f09b8b987b
e$ curl -w '\n' localhost:3002/admin/health
Behold! I live!!
$ docker ps
CONTAINER ID   IMAGE           COMMAND                  CREATED          STATUS          PORTS                                       NAMES
affad42ca413   mod-app-manager "docker-entrypoint.s…"   34 seconds ago   Up 33 seconds   0.0.0.0:3002->3002/tcp, :::3002->3002/tcp   MAS
$ docker stop MAS
MAS
```


## To run under an Okapi-mediated FOLIO in a Vagrant box

Start mod-app-manager in the host box where you are developing:
```
shell1$ yarn start
yarn run v1.22.18
$ env LOGCAT=listen,request,error babel-node --presets=env,stage-2 -- mod-app-manager.js etc/example-config.json
(listen) mod-app-manager listening on port 3002
[...]
```

In a second shell, set up an ssh tunnel, so that the virtual machine can see the running mod-app-manager in the host:
```
shell2$ cd vagrant
shell2$ vagrant ssh -- -R 3002:localhost:3002
vagrant@vagrant:~$ 
[...]
```

And in a third shell, tell Okapi (via the existing tunnel) about the newly available module, and how to access it via the tunnel, and to associate it with the tenant Diku:
```
curl -w '\n' -d @target/ModuleDescriptor.json http://localhost:9130/_/proxy/modules
curl -w '\n' -d @target/Discovery.json http://localhost:9130/_/discovery/modules
curl -w '\n' -d @target/Activate.json http://localhost:9130/_/proxy/tenants/diku/modules
```

## See also

* [The MAFIA project](https://github.com/MikeTaylor/mafia), of which this is a part.
* [The FAM (FOLIO Application Metadata) file format](https://github.com/MikeTaylor/mafia/blob/master/doc/folio-app-metadata.md).
* [Informal register of issues](TODO.md).

