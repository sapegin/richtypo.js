# Richtypo English Rule Package

Converts this:

```html
The quick brown FOX - weighting 47 kg - jumps over "the lazy dog" on
sunny morning...
```

to this:

```html
The quick brown FOX&#x202f;—&#x2009;weighting
47&nbsp;kg&#x202f;—&#x2009; jumps over “the lazy dog”
on&nbsp;sunny&nbsp;morning…
```

> [!NOTE]  
> `&#x202f;` is and HTML entity for a non-breaking thin space, `&#x2009;` for a thin space, and `&nbsp;` for a normal-width non-breaking space. HTML entities are shown only for clarity, since the spacing characters are invisible, Richtypo inserts Unicode characters instead, so it can be used for HTML, Markdown, or plan text.

### Installation

```bash
npm install --save richtypo richtypo-rules-en
```

### Basic usage

```javascript
import richtypo from 'richtypo';
import rules from 'richtypo-rules-en';

const text = `The quick brown FOX - weighting 47 kg - jumps over "the lazy dog" on sunny morning...`;

richtypo(rules, text);

// → The quick brown FOX&#x202f;—&#x2009;weighting 47&nbsp;kg&#x202f;—&#x2009;
//   jumps over “the lazy dog” on&nbsp;sunny&nbsp;morning…
```

The default export of `richtypo-rules-en` contains _recommended_ rules (marked with ¹ in a table below), but you can import each rule separately:

```js
import richtypo from 'richtypo';
import { quotes, numberSeparators } from 'richtypo-rules-en';
richtypo([quotes, numberSeparators], 'Text "in quotes" - 123456.78');
// → Text “in quotes” - 123,456.78
```

See more examples in [Richtypo docs](https://github.com/sapegin/richtypo.js).

### The rules

| Rule                  | Description                                                                     | Input                    | Output                                                     |
| --------------------- | ------------------------------------------------------------------------------- | ------------------------ | ---------------------------------------------------------- |
| **`abbrs`**           | wrap abbreviations in `<abbr>` tag                                              | `FOX`                    | `<abbr>FOX</abbr>`                                         |
| **`amps`**            | wrap ampersands (&) in `<span class="amp">` tag                                 | `Dog & Cat`              | `Dog <span class="amp">&</span> Cat`                       |
| **`dashesBasic`¹**    | replace `-` and `--` with an em-dashes                                          | `dog -- friend`          | `dog — friend`²                                            |
| **`dashesAdvanced`¹** | add a non-breaking thin space before an em dash, and a thin space after         | `dog - friend`           | `dog&#x202f;—&#x2009;friend`²                              |
| **`degreeSigns`¹**    | add a non-breaking thin space between a number and a degree sign (°)            | `13 °C`                  | `13&#x202f;°C`                                             |
| **`ellipses`¹**       | transform three dots (...) to an ellipsis (…)                                   | `...`                    | `…`                                                        |
| **`hyphenatedWords`** | wrap words with a hyphen in `<nobr>` tag                                        | `to-day`                 | `<nobr>to-day</nobr>`                                      |
| **`numberUnits`¹**    | add a non-breaking space between a number and its unit                          | `2 kg`                   | `2&nbsp;kg`²                                               |
| **`numbers`**         | adds thousands separators to large numbers and put ordinals within `<sup>` tags | `10000.123, 1st 2nd 3rd` | `10,000.123, 1<sup>st</sup> 2<sup>nd</sup> 3<sup>rd</sup>` |
| **`orphans`¹**        | add a non-breaking space in front of the last word in a paragraph (line)        | `their worst dreams`     | `their worst&nbsp;dreams`²                                 |
| **`quotes`¹**         | transform dumb quotes (") to typography quotes («»)                             | `text "in quotes"`       | `text «in quotes»`                                         |
| **`shortWords`¹**     | add a non-breaking space after short words                                      | `my dogs`                | `my&nbsp;dogs`²                                            |

_¹ Recommended rules (see code examples above)_

_² `&nbsp;` and other entities are rendered as Unicode characters, not an HTML entity. We use `&nbsp;`, etc. only in the docs for readability._
