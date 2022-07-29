# Informal register of issues for `mod-app-manager`

<span style="color:red">NOTE.</span>
This list is no longer used: all remaining open issues have been moved to
[the GitHub tracker](https://github.com/MikeTaylor/mod-app-manager/issues)

* **DONE** -- Generate descriptors from templates
* **DONE** -- Create a git repo containing FAM files ([`example-folio-app-source`](https://github.com/MikeTaylor/example-folio-app-source))
* **DONE** -- Handle GET on `/admin/health`, returning response code 200
* **DONE** -- Parse command-line arguments to allow e.g. `-p 3001` to change port
* **DONE** -- Configuration of which git repos to use
* **DONE** -- Add logging of requests (method + url)
* **DONE** -- Read git repo from within `mod-app-manager`
* **DONE** -- Handle GET on `/app-manager/apps`, using git response
* **DONE** -- Report GitHub HTTP errors (such as expired token) to client
* **DONE** -- Specify GitHub tokens in configuration file
* **DONE** -- Complete README.md
* **DONE** -- Include response code/message in "request" logging
* **DONE** -- Remove heath-check from module descriptor
* **DONE** -- Support for Docker
* **DONE** -- GitHub Actions for publishing
* **DONE** -- Make new GitHub apps repo with FAM for this module, add to configuration
* **DONE** -- Handle CRUD for git repo configuration, using mod-configuration
* **DONE** -- Drive `/app-manager/apps` from mod-configuration instead of hardwired config
* **DONE** -- Write Okapi proxying entries for config CRUD WSAPI
* **DONE** -- Add permissions for config CRUD, including permissions for mod-configuration
* **DONE** -- Add instructions for runing under Okapi.
* **DONE** -- Rename to `mod-app-manager: repo, program, variable names, API paths, permissions, etc.
* **DONE** -- When requests provide Okapi details (url, tenant, token) use these instead of configured
* **DONE** -- Add `env` logging category
* **DONE** -- Rewrite Configuration section of the documentation, which is now badly outdated
* **DONE** -- Write RAML and JSON Schemas/examples for the supported web-services
* **DONE** -- Make ID in POST response be of content-type `text/plain` with HTTP 201
* **DONE** -- Make empty DELETE and PUT responses use HTTP status 204
