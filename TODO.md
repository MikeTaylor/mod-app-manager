# Informal register of issues for `mod-app-store`

* **DONE** -- Generate descriptors from templates
* **DONE** -- Create a git repo containing FAM files ([`example-folio-app-source`](https://github.com/MikeTaylor/example-folio-app-source))
* **DONE** -- Handle GET on `/admin/health`, returning response code 200
* **DONE** -- Parse command-line arguments to allow e.g. `-p 3001` to change port
* **DONE** -- Configuration of which git repos to use
* **DONE** -- Add logging of requests (method + url)
* **DONE** -- Read git repo from within `mod-app-store`
* **DONE** -- Handle GET on `/app-store-apps`, using git response
* **DONE** -- Report GitHub HTTP errors (such as expired token) to client
* **DONE** -- Specify GitHub tokens in configuration file
* Complete README.md
* Remove heath-check from module descriptor.
* Write RAML for supported web-services
* Handle CRUD for git repo configuration, using mod-configuration
* Automated tests
* GitHub Actions for publishing
* Searching and sorting
* Response caching
* Optional arguments to control use of cache
* Transition to using the GitHub tracker for issues
