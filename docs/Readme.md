# Richtypo: HTML typography enhancer for Node.js

## Installation

```bash
npm install richtypo
```

## Rules

These modules contain recommended typography rules for different languages:

- [richtypo/rules/en](rules/EnglishRules.md): English
- [richtypo/rules/fr](rules/FrenchRules.md): French
- [richtypo/rules/ru](rules/RussianRules.md): Russian

## Usage

### Basic usage

```javascript
import richtypo from 'richtypo';
import rules from 'richtypo/rules/en';

const text =
  'There are 1000 "rules" to enrich your text with Richtypo.';

richtypo(rules, text);
```

Will produce something like that:

```html
There are 1,000 “rules” to&nbsp;enrich your text with&nbsp;Richtypo.
```

> [!NOTE]  
> The default export of `richtypo/rules/en` contains recommended rules, but you can import each rule separately, see below.

> [!NOTE]  
> `&nbsp;` is actually rendered by Richtypo as the Unicode character for non-breaking-space (`\xA0`) which works well with any modern browser. We use `&nbsp;` in the examples to make it visible.

> [!NOTE]  
> Richtypo works better when the input text is cleared from special characters. Use the [he package](https://github.com/mathiasbynens/he) and its [decode function](https://github.com/mathiasbynens/he#hedecodehtml-options) to remove special characters.

### Rules composition

Run only rules you need by importing them separately:

```javascript
import richtypo from 'richtypo';
import { spaces, quotes } from 'richtypo/rules/en';

const text =
  'There are 1000 "rules" to enrich your text with RichTypo.';

// this will only run spaces and quotes rules
richtypo([spaces, quotes], text);
```

> [!NOTE]  
> Have a look at [the example page](https://sapegin.github.io/richtypo.js/) and [its source](https://github.com/sapegin/richtypo.js/tree/master/example/src).

### Custom rules

Rules are JavaScript functions that take a string and return a transformed string. For example, a rule that replaces three dots (`...`) with an ellipsis (`…`) can look like this:

```javascript
function ellipsis(text) {
  return text.replace(/\.{2,}/gim, '…');
}
```

And then you use it as any other rule:

```javascript
import richtypo from 'richtypo';
richtypo(ellipsis, 'Typography everywhere...');
// -> Typography everywhere…
```

### Common rules

The [richtypo/rules/common](https://github.com/sapegin/richtypo.js/tree/master/packages/richtypo/rules/common) module contains common typography rules that you can use or extend in your own rules.

For example, the `ellipsis` rule replaces `...` with `…` symbol. Rather than you having to write that rule yourself, you can reexport it as part of your rules.

```js
import { ellipsis } from 'richtypo/rules/common';

export default {
  quoteToUnderscore,
  ellipsis
};
```

Some rules such as the `quotes` rule are factory rules and need to be “configured”.

```js
import { ellipsis, quotesFactory } from 'richtypo/rules/common';

export default {
  ellipsis,
  quotes: quotesFactory({ openingQuote: '«', closingQuote: '»' })
};
```

Check out the [complete list of common rules](rules/CommonRules.md).

### Definitions

The common rules module exports `definitions`, convenience constants that you can use in your own rules. For example, `definitions.quotes` is set as `'["“”«»‘’]'`, which allows you to write:

```js
import { definitions } from 'richtypo/rules/common';

function quoteToUnderscore(text) {
  return text.replace(new RegExp(`${definitions.quotes}`, 'gm'), '_');
}

export default {
  quoteToUnderscore
};
```
