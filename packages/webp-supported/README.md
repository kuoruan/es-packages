# webp-supported

Detect whether the browser supports WebP (0.3KB)

## Install

```sh
$ npm install --save @kuoruan/webp-supported
```

Or with Yarn

```sh
$ yarn add @kuoruan/webp-supported
```

## Usage

```javascript
import WebPSupported from "@kuoruan/webp-supported";

if (WebPSupported()) {
  console.log("Load WebP");
} else {
  console.log("Load JPEG");
}
```
