# luci-types

Typescript declaration files for OpenWrt LuCI2.


## Install

```sh
$ npm install --save @kuoruan/luci-types
```

Or with Yarn

```sh
$ yarn add @kuoruan/luci-types
```

## Usage

In ```tsconfig.json``` file, add ```node_modules/@kuoruan/luci-types/index.d.ts``` to include.

```json
{
  "compilerOptions": {
    ...
  },
  "include": [
    ...,
    "node_modules/@kuoruan/luci-types/index.d.ts"
  ]
}
```
