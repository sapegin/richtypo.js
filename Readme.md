# Richtypo: HTML typography enhancer for Node.js

[![npm](https://img.shields.io/npm/v/richtypo.svg)](https://www.npmjs.com/package/richtypo) [![Build Status](https://travis-ci.org/sapegin/richtypo.js.svg)](https://travis-ci.org/sapegin/richtypo.js) [![Codecov](https://codecov.io/gh/sapegin/richtypo.js/branch/master/graph/badge.svg)](https://codecov.io/gh/sapegin/richtypo.js)

Richtypo prepares your texts to publication on web: applies typography rules like quotes (`"` → `“”`), dashes (`-` → `—`) and non-breaking spaces to make text easier to read.

Richtypo comes with [typography rules](#rule-packages) for English, French and Russian, but you can customize them and create your own rules — each rule is an independent JavaScript function.

Have a look at [the example page](https://sapegin.github.io/richtypo.js/) and [its source](https://github.com/sapegin/richtypo.js/tree/master/example/src).

## Features

- Works with plain text, Markdown or HTML
- Takes care of your HTML tags
- English, French and Russian rules
- Run only rules you need
- Add your own rules
- Works server-side
- No big dependencies

## Installation

```bash
npm install richtypo
```

You will probably need to install a [rule package](#rule-packages) for your language, like this:

```bash
npm install richtypo-rules-en
```

But it’s not required, see how to [create your own rules](#custom-rules).

### Rule packages

These packcages contain recommended typography rules for different languages:

- [richtypo-rules-en](https://github.com/sapegin/richtypo.js/tree/master/packages/richtypo-rules-en): English
- [richtypo-rules-fr](https://github.com/sapegin/richtypo.js/tree/master/packages/richtypo-rules-fr): French
- [richtypo-rules-ru](https://github.com/sapegin/richtypo.js/tree/master/packages/richtypo-rules-ru): Russian

## Usage

### Basic usage

```javascript
import richtypo from 'richtypo';
import rules from 'richtypo-rules-en';

const text =
  'There are 1000 "rules" to enrich your text with Richtypo.';

richtypo(rules, text);
```

Will produce something like that:

```html
There are 1,000 “rules” to&nbsp;enrich your text with&nbsp;Richtypo.
```

> **Note:** The default export of `richtypo-rules-en` contains recommended rules but you can import each rule separately, see below.

> **Note:** `&nbsp;` is actually rendered by Richtypo as the Unicode character for non-breaking-space `\xA0` which works well with any modern browser. We use `&nbsp;` in the examples to make it visible.

> **Note:** Richtypo works better when the input text is cleared from special characters. Use the [he package](https://github.com/mathiasbynens/he) and its [decode function](https://github.com/mathiasbynens/he#hedecodehtml-options) to remove special characters.

### Currying

Richtypo can be curried and used as below:

```javascript
import richtypo from 'richtypo';
import rules from 'richtypo-rules-en';

const rt = richtypo(rules);
const text =
  'There are 1000 "rules" to enrich your text with Richtypo.';

// Will produce the same output as in the previous section
rt(text);
```

### Composition

Run only rules you need by importing them separately:

```javascript
import richtypo from 'richtypo';
import { spaces, quotes } from 'richtypo-rules-en';

const text =
  'There are 1000 "rules" to enrich your text with RichTypo.';

// this will only run spaces and quotes rules
richtypo([spaces, quotes], text);
```

> **Note:** Have a look at [the example page](https://sapegin.github.io/richtypo.js/) and [its source](https://github.com/sapegin/richtypo.js/tree/master/example/src).

### Custom rules

Rules are JavaScript functions that take a string and return a transformed string. For example, a rule that replaces three dots (`...`) with an ellipsis (`…`) can look like this:

```javascript
const ellipsis = text => text.replace(new RegExp(/\.{2,}/gim), '…');
```

And then you use it as any other rule:

```javascript
import richtypo from 'richtypo';
richtypo(ellipsis, 'Typography everywhere...');
// -> Typography everywhere…
```

#### Common rules package

[richtypo-rules-common](https://github.com/sapegin/richtypo.js/tree/master/packages/richtypo-rules-common) package contains common typography rules that you can use or extend in your own rules.

#### Definitions

The common rules package exports `definitions`, convenience constants that you can use in your own rules. For example, `definitions.quotes` is set as `'["“”«»‘’]'`, which allows you to write:

```js
import { definitions } from 'richtypo-rules-common';

const quoteToUnderscore = text =>
  text.replace(new RegExp(`${definitions.quotes}`, 'gm'), '_');

export default {
  quoteToUnderscore
};
```

##### Common rules

The common rules package also exports rules that you can reuse as is.

For example, the `ellipsis` rule replaces `...` with `…` symbol. Rather than you having to rewrite that rule, you can reexport it as part of your rules.

```js
import { ellipsis } from 'richtypo-rules-common';

export default {
  quoteToUnderscore,
  ellipsis
};
```

Some rules such as the `quotes` rule are factory rules and need to be “configured”.

```js
import { ellipsis, quotesFactory } from 'richtypo-rules-common';

export default {
  ellipsis,
  quotes: quotesFactory({ openingQuote: '«', closingQuote: '»' })
};
```

For the complete list of common rules, check out the [Readme page of the common rule package](https://github.com/sapegin/richtypo.js/tree/master/packages/richtypo-rules-common).

#### Testing

Don’t forget to test your rules. Have a look at the [English rules package](https://github.com/sapegin/richtypo.js/tree/master/packages/richtypo-rules-en) to see how tests are done.

## Changelog

The changelog can be found on the [Releases page](https://github.com/sapegin/richtypo.js/releases).

## Sponsoring

This software has been developed with lots of coffee, buy me one more cup to keep it going.

<a href="https://www.buymeacoffee.com/sapegin" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/lato-orange.png" alt="Buy Me A Coffee" height="51" width="217" ></a>

## Authors and license

[Artem Sapegin](https://sapegin.me) and [contributors](https://github.com/sapegin/stack-styled/graphs/contributors).

MIT License, see the included [License.md](License.md) file.
