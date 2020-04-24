# class-names

A util for conditionally joining classNames together

## Usage

```javascript
classNames('foo', 'bar'); // => 'foo bar'
classNames('foo', { bar: true }); // => 'foo bar'
classNames({ 'foo-bar': true }); // => 'foo-bar'
classNames({ 'foo-bar': false }); // => ''
classNames({ foo: true }, { bar: true }); // => 'foo bar'
classNames({ foo: true, bar: true }); // => 'foo bar'
```

With arrays:

```javascript
var arr = ['b', { c: true, d: false }];
classNames('a', arr); // => 'a b c'
```
