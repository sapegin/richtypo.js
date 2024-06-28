# Richtypo common typography rules

A convenience package to create [Richtypo](https://github.com/sapegin/richtypo.js) typography rules for different languages.

It includes definitions, rules and rule factories.

### Definitions

Use definitions to improve readability of your rules:

```js
import { definitions } from 'richtypo-common-rules';
const { space, nbsp } = definitions;
export const numberSigns = text =>
  text.replace(new RegExp(`№${space}`, 'g'), `№${nbsp}`);
```

| Definition name | Description |
| --- | --- |
| **`dash`** | hyphen (-) or em dash (—) |
| **`thinspace`** | thin space (`\u2009`). |
| **`nbthinspace`** | thin non-breaking space (`\u202f`). |
| **`letter`** | any European or Cyrillic letter |
| **`letterOrQuote`** | any European or Cyrillic letter with quotes |
| **`nbsp`** | non-breaking space |
| **`notInTag`** | negative lookbehind to make sure we're not running rules inside an HTML tag. It’s usually added to the beginning of `RegExp` in most rules |
| **`openingQuote`** | any opening quote |
| **`punctuation`** | punctuation symbols |
| **`quote`** | any quotes |
| **`semicolon`** | a semicolon |
| **`shortWord`** | a word of one or two letters |
| **`space`** | any space (except `\n`) |
| **`tag`** | matches any HTML tag |
| **`upperLetter`** | any uppercase European or Cyrillic letter |

### Rules

Rules are available as named exports:

```js
import { abbrs } from 'richtypo-common-rules';
```

| Rule name | Description | Input | Output |
| --- | --- | --- | --- |
| **`abbrs`** | wrap abbreviations in `<abbr>` tags | `ONU` | `<abbr>ONU</abbr>` |
| **`amps`** | wrap an ampersand (&) in `<span class="amp">` tags | `Cie & Sons` | `Cie <span class="amp">&</span> Sons` |
| **`dashesBasic`** | replace `-` and `--` with an em-dashes | `dog -- friend` | `dog — friend`¹ |
| **`dashesAdvanced`** | add a non-breaking thin space before an em dash, and a thin space after | `dog - friend` | `dog&#x202f;—&#x2009;friend`¹ |
| **`degreeSigns`** | add a non-breaking thin space between numbers and degree symbol | `34 ° or 34°` | `34&#x202f;°` |
| **`ellipses`** | replace three consecutive dots with an ellipsis | `oh...` | `oh…` |
| **`numberUnits`** | insert non-breaking space between numbers and the following word | `100 km` | `100&nbsp;km`¹ |
| **`orphans`** | add a non-breaking space to avoid orphans | `We go to the mall` | `We go to the&nbsp;mall`¹ |
| **`shortWords`** | add a non-breaking space after short words | `We go to the mall` | `We&nbsp;go&nbsp;to&nbsp;the mall`¹ |

_¹ `&nbsp;` is actually rendered as a symbol (`\xA0`), not an HTML entity. We use `&nbsp;` only in the docs for readability._

### Rule factories

Use factory rules to customize some common rules, like quotes, for your language. For example, quotes in English are written as `“”` while in French they are written as `«»`.

```js
import { quotesFactory } from 'richtypo-rules-common';
export const quotes = quotesFactory({
  openingQuote: '«',
  closingQuote: '»'
});
```

| Rule | Arguments | Description |
| --- | --- | --- | --- | --- | --- |
| **`numberOrdinalsFactory`** | `{ ordinal }` | format _1st, 2nd, 3rd_ etc. into _1st, 2nd, 3rd_. `ordinal` should be a regex array of strings such as `'(st | nd | rd | th)'`. |
| **`numberSeparatorsFactory`** | `{ decimalsSeparator, thousandsSeparator }` | format numbers with thousands separator |
| **`quotesFactory`** | `{ openingQuote, closingQuote }` | replace dumb quotes with typography quotes |
