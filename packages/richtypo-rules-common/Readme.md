# Richtypo Common Rule Package

As explained [here](https://github.com/sapegin/richtypo.js/tree/next#rule-packages), the common rule package is a convenience package to create rules more easily.

It includes `definitions` and a list of rules.

### Definitions

Definitions can be imported as in `import { definitions } from 'richtypo-common-rules'` and can be used to simplify readability of your own rules.

Definitions include:

- **`nbsp`**: non breaking space
- **`hairspace`**: narrow non breaking space (`\xAF`). Note that Richtypo will automatically replace it with HTML character `&#x202f;` that a browser can render.
- **`space`**: any space (except `\n`)
- **`tag`**: a HTML tag (generally used a negative lookbehind to make sure we're not running rules inside HTML tags)
- **`quotes`**: any quotes
- **`letters`**: any european letter
- **`upperletters`**: any uppercase european letter
- **`letterswithquotes`**: any european letter with quotes
- **`semicolon`**: a semicolon (making sure it doesn't match semicolon in special html characters such as `&nbsp;`)
- **`punctuation`**: punctuation symbols
- **`dash`**: any dash
- **`openingQuotes`**: any opening quote
- **`shortWord`**: a word of one or two letters

### Rules

Rules can be imported as in `import { ruleName } from 'richtypo-common-rules'`.

Common rules are:

_For better readability, non breaking space symbols `&nbsp;` are replaced with two underscores `__`_

- **`numberUnits`**: inserts non breaking space between numbers and the following word `100 km → 100__km`
- **`temperature`**: fixes space between numbers and temperature symbol `34 ° or 34° → 34__°`
- **`shortWordBreak`**: adds a non breaking space after short words `We go to the mall → We__go__to__the mall`
- **`orphans`**: adds a non breaking space to avoid orphas `We go to the mall → We go to the__mall`
- **`spaces`**: composed rule that executes `numberUnits`, `temperature`, `shortWordBreak` and `orphans`
- **`abbr`**: wraps short uppercase words in `<abbr>` tags
- **`emdash`**:
- **`ellipsis`**:
- **`amp`**: decorative rule that wraps ampersand `&` in `<span class="amp">` tags.

- **`quotesFactory`**:
- **`numberOrdinalsFactory`**:
- **`numberSeparatorsFactory`**:
