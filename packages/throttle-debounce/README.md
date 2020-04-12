# throttle-debounce

Typescript version of throttle and debounce function.

## Install

``` sh
npm install --save @kuoruan/throttle-debounce
```

Or with Yarn

``` sh
yarn add @kuoruan/throttle-debounce
```

## Useage

### throttle

``` js
import { throttle } from "@kuoruan/throttle-debounce";

const onWindowResize = throttle(function(this: Window, e: Event) {
  console.log("resized", this.innerWidth, this.innerHeight);
}, 20);

window.addEventListener("resize", onWindowResize, false);
```

### debounce

``` ts
import { debounce } from "@kuoruan/throttle-debounce";

const input: HTMLInputElement = document.querySelector("#search");

const onInputChange = debounce(function(this: HTMLInputElement, e: Event) {
  console.log("Your input is: " + this.value);
}, 100);

input.addEventListener("change", onInputChange, false);
```

## API

### throttle

**function <T extends (...args: any[]) => any>(func: T, threshhold?: number, scope?: any): T;**

#### func

Type: ```T extends (...args: any[]) => any``` (Function)

Optional: false

The function to be throttled.

#### threshhold

Type: ```number```

Optional: true

Default: 20

The threshhold in milliseconds, must greater than zero.

#### scope

Type: any

Optional: true

The ```context``` or ```thisArg``` used by apply. See: [Function.prototype.apply()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

### debounce

**function <T extends (...args: any[]) => any>(func: T, delay?: number, scope?: any): T;**

#### func

Type: ```T extends (...args: any[]) => any``` (Function)

Optional: false

The function to be debounced.

#### delay

Type: ```number```

Optional: true

Default: 20

The delay in milliseconds, must greater than zero.

#### scope

Type: any

Optional: true

The ```context``` or ```thisArg``` used by apply. See: [Function.prototype.apply()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
