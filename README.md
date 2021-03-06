[![NPM](https://nodei.co/npm/shoetest.png?downloads=true)](https://nodei.co/npm/shoetest/)

Shoetest.js
=========

Powerful string matching insensitive to diacritics, special characters, symbols and case.

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
  
  shoetest.test('hello world', a);
  // -> true

  shoetest.test('hello world', [a, b, c]);
  // -> true

  shoetest.match('Helló (wơrLd)', a);
  // -> [ 'heļlṏ, wɵrḻɖ' ]

  shoetest.match('algae britannicae', b);
  // -> [ 'Algæ Britannicæ' ]

  shoetest.match('creme', c);
  // -> [ 'Crème', 'Crème', 'Crème' ]

  shoetest.replace('creme', '<b>$1</b>', c);
  // -> 'The <b>Crème</b> de la <b>Crème</b> de la <b>Crème</b>!'

  shoetest.replace('creme', 'Crème fraîche', [a, b, c]);
  // -> [ 'heļlṏ, wɵrḻɖ!', 'Algæ Britannicæ', 'The Crème fraîche de la Crème fraîche de la Crème fraîche!' ]

  shoetest.simplify('Ƀuffalỗ buḟḟaḻở Ḅuƒfalo ḅuffȃlỗ bufｆalȏ bǖffaḻồ Ƀⓤffalo buƒfalɵ');
  // -> 'Buffalo buffalo Buffalo buffalo buffalo buffalo Buffalo buffalo'
  
  shoetest.complexify('This is Mars!');
  // -> 'Thíṣ ịṥ Mârs!'
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

### options.symbols
Type: `Boolean`
Default value: `false`

Match the symbols of the query.

### options.whitespaces
Type: `Boolean`
Default value: `false`

Match the exact whitespaces of the query. For instance, by default, will allow a tabulation instead of a space.

### options.boundaries
Type: `Boolean`
Default value: `true`

Match the word boundaries of the query.

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
