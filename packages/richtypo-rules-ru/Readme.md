# Richtypo Russian typography rules

The Russian typography rules for [Richtypo](https://github.com/sapegin/richtypo.js).

Converts this:

```html
Настругал Папа Карло тысячу БУРАТИН 29 февраля -
используйте "Ричтайпо" и ваши уши будут торчать из-за туч.
```

to this:

```html
Настругал Папа Карло тысячу <abbr>БУРАТИН</abbr> 29_февраля_=
используйте «Ричтайпо» и_ваши уши будут торчать <nobr>из-за</nobr>_туч.
```

### Installation

```bash
npm install --save richtypo richtypo-rules-ru
```

### Basic usage

```javascript
import richtypo from 'richtypo';
import rules from 'richtypo-rules-ru';

const text =
  'Настругал Папа Карло тысячу БУРАТИН 29 февраля - ' +
  'используйте "Ричтайпо" и ваши уши будут торчать из-за туч.';

richtypo(rules, text);

// -> Настругал Папа Карло тысячу <abbr>БУРАТИН</abbr> 29_февраля_=
//    используйте «Ричтайпо» и_ваши уши будут торчать <nobr>из-за</nobr>_туч.
```

The default export of `richtypo-rules-ru` contains _recommended_ rules (marked with ¹ in a table below), but you can import each rule separately:

```js
import richtypo from 'richtypo';
import { quotes, numberSeparators } from 'richtypo-rules-ru';
richtypo(
  [quotes, numberSeparators],
  'Текст "в кавычках" - 123456,78'
);
// -> Текст «в кавычках» - 123&#x202f;456,78
```

See more examples in [Richtypo docs](https://github.com/sapegin/richtypo.js).

### The rules

| Rule                   | Description                                                                                      | Input                | Output                     |
| ---------------------- | ------------------------------------------------------------------------------------------------ | -------------------- | -------------------------- |
| **`abbrs`¹**           | wrap abbreviations in `<abbr>` tag                                                               | `БКОАНТОЛО`          | `<abbr>БКОАНТОЛО</abbr>`   |
| **`dashes`¹**          | transform a dash between two words to an em dash (—), add a non-breaking space before an em dash | `собака - друг`      | `собака&nbsp;— друг`²      |
| **`degreeSigns`¹**     | add a non-breaking space between a number and a degree sign (°)                                  | `13 °C`              | `13&nbsp;°C`²              |
| **`ellipses`¹**        | transform three dots (...) to an ellipsis (…)                                                    | `...`                | `…`                        |
| **`etcs`¹**            | add a non-breaking space inside “и т. д.” and “и т. п.”                                          | `и т. д.`            | `и&nbsp;т.&nbsp;д.`²       |
| **`hyphenatedWords`¹** | wrap words with a hyphen in `<nobr>` tag                                                         | `из-за`              | `<nobr>из-за</nobr>`       |
| **`initials`¹**        | wrap initials in `<nobr>` tag                                                                    | `В. И. Ленин`        | `<nobr>В. И. Ленин</nobr>` |
| **`numberSigns`¹**     | add a non-breaking space between a number sign (№) and a number                                  | `№ 3`                | `№&nbsp;3`²                |
| **`numberUnits`¹**     | add a non-breaking space between a number and its unit                                           | `2 кг`               | `2&nbsp;кг`²               |
| **`orphans`¹**         | add a non-breaking space in front of the last word in a paragraph (line)                         | `собака лучший друг` | `собака лучший&nbsp;друг`² |
| **`particles`¹**       | add a non-breaking space before particles                                                        | `это ж как бы`       | `это&nbsp;ж как&nbsp;бы`²  |
| **`quotes`¹**          | transform dumb quotes (") to typography quotes («»)                                              | `текст "в кавычках"` | `текст «в кавычках»`       |
| **`sectionSigns`¹**    | add a non-breaking space between a section sign (§) and a number                                 | `§ 3`                | `§&nbsp;3`²                |
| **`shortWords`¹**      | add a non-breaking space after short words                                                       | `в печали`           | `в&nbsp;печали`²           |

_¹ Recommended rules (see code examples above)_

_² `&nbsp;` is actually rendered as a symbol (`\xA0`), not an HTML entity. We use `&nbsp;` only in the docs for readability._
