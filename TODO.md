# Informal register of issues for `mod-app-store`

* **DONE** -- Generate descriptors from templates
* **DONE** -- Create a git repo containing FAM files ([`example-folio-app-source`](https://github.com/MikeTaylor/example-folio-app-source))
* **DONE** -- Handle GET on `/admin/health`, returning response code 200
* **DONE** -- Parse command-line arguments to allow e.g. `-p 3001` to change port
* **DONE** -- Configuration of which git repos to use
* **DONE** -- Add logging of requests (method + url)
* **DONE** -- Read git repo from within `mod-app-store`
* **DONE** -- Handle GET on `/app-store/apps`, using git response
* **DONE** -- Report GitHub HTTP errors (such as expired token) to client
* **DONE** -- Specify GitHub tokens in configuration file
* **DONE** -- Complete README.md
* **DONE** -- Include response code/message in "request" logging
* **DONE** -- Remove heath-check from module descriptor
* **DONE** -- Support for Docker
* **DONE** -- GitHub Actions for publishing
* **DONE** -- Make new GitHub apps repo with FAM for this module, add to configuration
* **DONE** -- Handle CRUD for git repo configuration, using mod-configuration
* **DONE** -- Drive `/app-store/apps` from mod-configuration instead of hardwired config
* Add permissions for config CRUD, including permissions for mod-configuration
* Support `_tenant` interface for `loadReference` and `loadSample` operations: see https://folio-project.slack.com/archives/C210RP0T1/p1658220229855719?thread_ts=1657926630.076809&cid=C210RP0T1
* Write RAML for supported web-services
* Automated tests
* Searching and sorting of apps
* Transition to using the GitHub tracker for issues
