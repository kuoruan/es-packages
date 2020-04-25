# class-names

A util for conditionally joining classNames together

## Install

``` sh
$ npm install --save @kuoruan/class-names
```

Or with Yarn

``` sh
$ yarn add @kuoruan/class-names
```

## Usage

```javascript
import ClassNames from "@kuoruan/class-names";

ClassNames('foo', 'bar'); // => 'foo bar'
ClassNames('foo', { bar: true }); // => 'foo bar'
ClassNames({ 'foo-bar': true }); // => 'foo-bar'
ClassNames({ 'foo-bar': false }); // => ''
ClassNames({ foo: true }, { bar: true }); // => 'foo bar'
ClassNames({ foo: true, bar: true }); // => 'foo bar'
```

With arrays:

```javascript
import ClassNames from "@kuoruan/class-names";

const arr = ['b', { c: true, d: false }];
ClassNames('a', arr); // => 'a b c'
```
