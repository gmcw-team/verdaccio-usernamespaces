# verdaccio-usernamespaces

Verdaccio Plugin to allow package access based on username matching package names

## Installation

```bash
$ npm i -g verdaccio-usernamespaces
```

## Configuration

```yaml
# config.yaml

auth:
  usernamespaces: {}
  # Use other authentication plugins here.
packages:
  '@*/*':
    access: '$usernamespace'
    publish: '$usernamespace'
    unpublish:
```

The above configuration will allow access when the scope name is the username
For example, the user `meseta` is able to access package `@meseta/package_name`

```yaml
# config.yaml

auth:
  usernamespaces:
    match-packagename: true
  # Use other authentication plugins here.
packages:
  '@*/*':
    access: '$usernamespace'
    publish: '$usernamespace'
    unpublish:
```

The above configuration will allow access when the package name begins with the username followed by a dot `.`.
For example, the user `meseta` is able to access package `meseta.package_name` or `@namespace/meseta.package_name`
