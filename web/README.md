# Integration Platform Console

Developer Console For Integration Platform. There are three parts of this project.

1. Developer console
2. Admin console
3. Docs site

## Setup

Node JS: 16

```shell
npm install
```

## Dev
```shell
npm run dev:dev # for developer console
npm run admin:dev # for admin console
npm run docs:dev # for docs site
```

## Build
Check out master branch. Run following command
```shell
npm run build
```
The build will be in ./dist folder.

Copy all the files to integration-server/src/main/resources/webroot

