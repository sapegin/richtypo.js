# Richtypo Common Rule Package

As explained [here](https://github.com/sapegin/richtypo.js/tree/next#rule-packages), the common rule package is a convenience package to create rules more easily.

It includes `definitions` and a list of rules.

### Definitions

Definitions can be imported as in `import { definitions } from 'richtypo-common-rules'` and can be used to simplify readability of your own rules.

Definitions include:

- **`nbsp`**: non breaking space
- **`hairspace`**: narrow non breaking space (`\xAF`). Note that Richtypo will automatically replace it with HTML character `&#x202f;` that a browser can render.
- **`space`**: any space (except `\n`)
- **`tag`**: matches a HTML tag
- **`quotes`**: any quotes
- **`letters`**: any european letter
- **`upperletters`**: any uppercase european letter
- **`letterswithquotes`**: any european letter with quotes
- **`semicolon`**: a semicolon (making sure it doesn't match semicolon in special html characters such as `&nbsp;`)
- **`punctuation`**: punctuation symbols
- **`dash`**: any dash
- **`openingQuotes`**: any opening quote
- **`shortWord`**: a word of one or two letters,
- **`notInTag`**: negative lookbehind to make sure we're not running rules inside a HTML tag. It's usually added to the beginning of `RegExp` in most rules.

### Common rules

Common rules can be imported as in `import { ruleName } from 'richtypo-common-rules'`.

Common rules are:

_For better readability, the non-breaking space symbol `&nbsp;` is replaced with two underscores `__`_

- **`numberUnits`**: inserts non breaking space between numbers and the following word `100 km → 100__km`
- **`temperature`**: fixes space between numbers and temperature symbol → `34 ° or 34° → 34__°`
- **`shortWordBreak`**: adds a non breaking space after short words → `We go to the mall → We__go__to__the mall`
- **`orphans`**: adds a non breaking space to avoid orphans → `We go to the mall → We go to the__mall`
- **`spaces`**: composed rule that executes `numberUnits`, `temperature`, `shortWordBreak` and `orphans`
- **`abbr`**: wraps short uppercase words in `<abbr>` tags
- **`emdash`**:
- **`ellipsis`**:
- **`amp`**: decorative rule that wraps ampersand `&` in `<span class="amp">` tags.

### Factory rules

Some rules called factory rules expect an argument that depends on the language itself. For example, quotes in English and most other countries are written as `“”` while in French they are shown as `«»`. Therefore, the common rule `quotesFactory` is passed `openingQuote` and `closingQuote` characters as arguments.

```js
import { quotesFactory } from 'richtypo-rules-common';
const quotes = quotesFactory({
  openingQuote: '«',
  closingQuote: '»'
});
```

- **`quotesFactory(`** `{ openingQuote, closingQuote }` **`)`**: helper to replace straight quotes.
- **`numberSeparatorsFactory(`** `{ decimalsSeparator, thousandsSeparator }` **`)`**: formats numbers with thousands separator. `decimalsSeparator` is not used to replace anything, it helps `numberSeparatorsFactory(` to identify decimals and avoid adding a separator within decimals.
- **`numberOrdinalsFactory(`** `{ ordinals }` **`)`**: helper to format _1st, 2nd, 3rd_ etc. into _1<sup>st</sup>, 2<sup>nd</sup>, 3<sup>rd</sup>_. `ordinals` should be a regex array of strings such as `'(st|nd|rd|th)'`.
