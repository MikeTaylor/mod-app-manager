# Change history for mod-app-manager

## [1.2.0](https://github.com/MikeTaylor/mod-app-manager/tree/v1.2.0) (2022-08-10)

* Drive `/app-manager/apps` from mod-configuration instead of hardwired config
* Write Okapi proxying entries for config CRUD WSAPI
* Add permissions for config CRUD, including permissions for mod-configuration
* Add instructions for runing under Okapi.
* Rename from `mod-app-store` to `mod-app-manager`
* When requests provide Okapi details (url, tenant, token) use these instead of configured
* Add `env` logging category
* Upate the Configuration section of the documentation
* Write RAML and JSON Schemas/examples for the supported web-services
* Make ID in POST response be of content-type `text/plain` with HTTP 201
* Make empty DELETE and PUT responses use HTTP status 204

## [1.1.0](https://github.com/MikeTaylor/mod-app-store/tree/v1.1.0) (2022-07-18)

* CRUD for configuration.

## [1.0.0](https://github.com/MikeTaylor/mod-app-store/tree/v1.0.0) (IN PROGRESS)

* First formal release.

