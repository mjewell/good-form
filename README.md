# Lib Template

Clone this repo to get a bunch of helpful settings for creating an npm library with typescript or javascript.

## Setup

- git clone git@github.com:mjewell/lib-template.git <my-project>
- update package.json:
  - name
  - repository.url
  - bugs.url
  - homepage

## Typescript only

If you're only using typescript update your tsconfig to include:

```
allowJs: false,
declaration: true
```

and update package.json to include:

```
"typings": "dist/index.d.ts",
```
