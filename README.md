Shoetest.js
=========

Powerful string matching insensitive to diacritics, special characters, case and punctuation.

## Installation

```shell
  npm install shoetest --save
```

## Usage

```js
  var shoetest = require('shoetest');

  var a = 'heļlṏ, wɵrḻɖ!';
  var b = 'Algæ Britannicæ';
  var c = 'The Crème de la Crème de la Crème!';
  
  shoetest.test('hello world', [a, b, c]);
  // -> true

  shoetest.match('Helló (wơrLd)', [a, b, c]);
  // -> [ 'heļlṏ, wɵrḻɖ' ]

  shoetest.match('algae britannicae', [a, b, c]);
  // -> [ 'Algæ Britannicæ' ]

  shoetest.match('creme', [a, b, c]);
  // -> [ 'Crème', 'Crème', 'Crème' ]

  shoetest.simplify('Ƀuffalỗ buḟḟaḻở Ḅuƒfalo ḅuffȃlỗ bufｆalȏ bǖffaḻồ Ƀⓤffalo buƒfalɵ');
  // -> 'Buffalo buffalo Buffalo buffalo buffalo buffalo Buffalo buffalo'
```

## Advanced usage

```js
  var options = {
    charCase: true,
    begin: '\\b',
    end: '\\b'
  }

  shoetest.test('creme de la creme', c, options);
  // -> false

  shoetest.test('Creme de la Creme', c, options);
  // -> true

  shoetest.test('Alg', b);
  // -> true

  shoetest.test('Alg', b, options);
  // -> false

```

## Bonus

```js
  shoetest.fun('This is Mars!');
  // -> 'Thíṣ ịṥ Mârs!'
```

## Options

### options.strict
Type: `Boolean`
Default value: `true`

Match strictly diacritics. In non strict mode, other special characters can be matched such as `s` with `$` or `e` with `€`.

### options.diacritics
Type: `Boolean`
Default value: `false`

Match the diacritics of the query.

### options.charCase
Type: `Boolean`
Default value: `false`

Match the case of the query.

### options.punctuation
Type: `Boolean`
Default value: `false`

Match the punctuation of the query.

### options.whitespaces
Type: `Boolean`
Default value: `false`

Match the exact whitespaces of the query. For instance, by default, will allow a tabulation instead of a space.

### options.boundaries
Type: `Boolean`
Default value: `true`

Match the word boundaries of the query. Attention, setting boundaries to false may impact performance.

### options.begin
Type: `String`
Default value: ``

Add custom regular expression at the beginning of the query. Escape when necessary, e.g. `\\b` instead of `\b`.

### options.end
Type: `String`
Default value: ``

Add custom regular expression at the end of the query. Escape when necessary, e.g. `\\b` instead of `\b`.

## Tests

```shell
   npm test
```

## Contributing

Pull requests are welcome. If you add functionality, then please add unit tests to cover it.

If you wish to update the reference list, only add special characters translated to 3 or less basic latin characters.

## Release History

* 0.1.0 Initial release
