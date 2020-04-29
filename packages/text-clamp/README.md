# text-clamp

Clamps an HTML element by adding ellipsis to it.

Copy from josephschmitt/Clamp.js and rewrite with typescript.

## Install

``` sh
$ npm install --save @kuoruan/text-clamp
```

Or with Yarn

``` sh
$ yarn add @kuoruan/text-clamp
```

## Useage

### throttle

``` js
import TextClamp from "@kuoruan/text-clamp";

const myHeader = document.getElementsByTagNames("h1")[0];

// Single line
TextClamp(myHeader, 1);

// Multi-line
TextClamp(myHeader, {clamp: 3});

// Auto-clamp based on a fixed element height
TextClamp(myHeader, {clamp: "35px"});
```

## Options

type: ```number | string | object```

### Option Object

```ts
type Options = {
  clamp?: number | string | "auto";
  useNativeClamp?: boolean;
  splitOnChars?: string[];
  animate?: boolean | number;
  truncationChar?: string;
  truncationHTML?: string;
  onTruncated?: OnTruncatedCallback;
};
```

#### clamp

Type: ```number | string | "auto"```

Optional: true

Default: ```2```

The lines or height of the Element.

#### useNativeClamp

Type: ```boolean```

Optional: true

Default: ```true```

Enables or disables using the native -webkit-line-clamp in a supported browser (ie. Webkit).

### truncationChar

Type: ```string```

Optional: true

Default: ```…```

The character to insert at the end of the HTML element after truncation is performed.

#### truncationHTML

Type: ```string```

Optional: true

A string of HTML to insert before the truncation character. This is useful if you'd like to add a "Read more" link or some such thing at the end of your clamped node.

#### splitOnChars

Type: ```string[]```

Optional: true

Default: ```[".", "-", "–", "—", " "]```

Determines what characters to use to chunk an element into smaller pieces.

#### animate

Type: ```boolean```

Optional: true

Default: ```false```

When set to true, will animate removing individual characters from the end of the element until the content fits.

#### onClamped

type: ```(el: HTMLElement, clampValue: number, maxHeight: number) => void```

Optional: true

Default: ```() => {}```

Callback when element clamped.
