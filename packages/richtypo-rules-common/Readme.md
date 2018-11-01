# Richtypo Common Rule Package

As explained [here](https://github.com/sapegin/richtypo.js/tree/next#rule-packages), the common rule package is a convenience package to create rules more easily.

It includes `definitions` and a list of rules.

### Definitions

Definitions can be imported as in `import { definitions } from 'richtypo-common-rules'` and can be used to simplify readability of your own rules.

| Definition              | Description                                                                                                                                                        | RegExp                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| **`nbsp`**              | non breaking space                                                                                                                                                 | `\xA0`                       |
| **`hairspace`**         | narrow non breaking space (`\xAF`). Note that Richtypo will automatically replace it with the HTML entity `&#x202f` that modern browsers should be able to render. | `\xAF`                       |
| **`space`**             | any space (except `\n`)                                                                                                                                            | `[ \t${nbsp}${hairspace}]`   |
| **`tag`**               | matches any HTML tag                                                                                                                                               | `(?:<[^<>]*>)`               |
| **`quotes`**            | any quotes                                                                                                                                                         | `["“”«»‘’]`                  |
| **`letters`**           | any european letter                                                                                                                                                | `[a-zà-ž0-9а-яё]`            |
| **`upperletters`**      | any uppercase european letter                                                                                                                                      | `[A-ZÀ-ŽА-ЯЁ]`               |
| **`letterswithquotes`** | any european letter with quotes                                                                                                                                    | `(?:${letters}|[-“”‘’«»])`   |
| **`semicolon`**         | a semicolon (making sure it doesn't match semicolon in special html characters such as ``) | `(?<!&\\S*);`                                                         |
| **`punctuation`**       | punctuation symbols                                                                                                                                                | `(?:${semicolon}|[\\.,!?:])` |
| **`dash`**              | hyphen or dash                                                                                                                                                     | `[-—]`                       |
| **`openingQuotes`**     | any opening quote                                                                                                                                                  | `[“«]`                       |
| **`shortWord`**         | a word of one or two letters                                                                                                                                       | `${letters}{1,2}`            |
| **`notInTag`**          | negative lookbehind to make sure we're not running rules inside a HTML tag. It's usually added to the beginning of `RegExp` in most rules.                         | `(?<!<[>]*)`                 |

### Common rules

A rule from `richtypo-rules-common` can be imported as in `import { ruleName } from 'richtypo-common-rules'`.

_For better readability, the non-breaking space symbol `&nbsp;` is replaced with two underscores `__`_

| Rule                 | Description                                                                                 | Input               | Output                                |
| -------------------- | ------------------------------------------------------------------------------------------- | ------------------- | ------------------------------------- |
| **`numberUnits`**    | inserts non breaking space between numbers and the following word                           | `100 km`            | `100__km`                             |
| **`temperature`**    | fixes space between numbers and temperature symbol                                          | `34 ° or 34°`       | `34__°`                               |
| **`shortWordBreak`** | adds a non breaking space after short words                                                 | `We go to the mall` | `We__go__to__the mall`                |
| **`orphans`**        | adds a non breaking space to avoid orphans                                                  | `We go to the mall` | `We go to the__mall`                  |
| **`spaces`**         | composed rule that executes `numberUnits`, `temperature`, `shortWordBreak` and `orphans`    |                     |                                       |
| **`abbr`**           | wraps short uppercase words in `<abbr>` tags                                                | `ONU`               | `ONU`                                 |
| **`emdash`**         | replaces the hyphen character into a dash and adds non breaking spaces when it makes sense. | `- Hello`           | `—__Hello`                            |
| **`ellipsis`**       | replaces three consecutive dots into ellipsis                                               | `oh...`             | `oh…`                                 |
| **`amp`**            | decorative rule that wraps ampersand `&` in `<span class="amp">` tags.                      | `Cie & Sons`        | `Cie <span class="amp">&</span> Sons` |

### Factory rules

Some rules called factory rules expect an argument that depends on the language itself. For example, quotes in English and most other countries are written as `“”` while in French they are shown as `«»`. Therefore, the common rule `quotesFactory` is passed `openingQuote` and `closingQuote` characters as arguments.

```js
import { quotesFactory } from 'richtypo-rules-common';

const quotes = quotesFactory({
  openingQuote: '«',
  closingQuote: '»'
});
```

| Rule                          | Arguments                                   | Description                                                                                                                                                                               |
| ----------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`quotesFactory`**           | `{ openingQuote, closingQuote }`            | helper to replace straight quotes.                                                                                                                                                        |
| **`numberSeparatorsFactory`** | `{ decimalsSeparator, thousandsSeparator }` | formats numbers with thousands separator. `decimalsSeparator` is not used to replace anything, it just allows the rule to identify decimals and avoid adding a separator within decimals. |
| **`numberOrdinalsFactory`**   | `{ ordinals }`                              | helper to format _1st, 2nd, 3rd_ etc. into _1st, 2nd, 3rd_. `ordinals` should be a regex array of strings such as `'(st|nd|rd|th)'`.                                                      |
