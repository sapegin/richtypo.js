# Richtypo: HTML typography enhancer for Node

[![npm](https://img.shields.io/npm/v/richtypo.svg)](https://www.npmjs.com/package/richtypo) [![Build Status](https://travis-ci.org/sapegin/richtypo.js.svg)](https://travis-ci.org/sapegin/richtypo.js)

Richtypo adds non-breaking spaces in the right places, `<nobr>` and `<abbr>` tags and wraps ampersands with a CSS class for special styling. It expects that your texts already have the right quotes, em-dashes and other symbols (you can use [Typography Keyboard Layout](http://ilyabirman.net/projects/typography-layout/)).

Richtypo aims at proposing a framework for adding typographic rules to plain or HTML text. You can define your own set of rules or import

## Features

- Rules for English and Russian languages
- Non-breaking spaces after prepositions and conjunctions, before em-dash, etc.
- `<nobr>` for words with hyphens
- CSS classes for ampersands
- `<abbr>` for abbreviations
- Takes care of your HTML tags
- Simple typographer (quotes, em-dash, etc.) for user generated content (like comments)
- No dependencies

## Example

```javascript
const richtypo = require('richtypo');
const beautiful = richtypo.rich(
  'Welcome to the world of beautiful web typography — only with Richtypo.'
);
const awesome = richtypo.title(
  'Beautiful &amp; Awesome Web Typography with “Richtypo”'
);
const ok = richtypo.lite('"Richtypo" - awesome!');
```

Will produce something like that:

```html
Welcome to&nbsp;the&nbsp;world of&nbsp;beautiful web <nobr>typography&#x202F;—</nobr>&#x202F;only with&nbsp;Richtypo.
Beautiful <span class="amp">&amp;</span> Awesome Web Typography with “Richtypo”'
<nobr>“Richtypo”&#x202F;—</nobr>&#x202F;awesome!
```

**Note: all methods render `&nbsp;` as an actual non-breaking space (`\xA0`).**

Also look at [the example page](http://sapegin.github.io/richtypo.js/) and [its source](https://github.com/sapegin/richtypo.js/tree/master/example).

## Styles

Richtypo wraps abbreviations in `<abbr>` tags. It also wraps ampersands and leading quotes to allow custom styling:

| Character | Spacer class | Character class |
| --------- | ------------ | --------------- |
| `&`       |              | `.amp`          |

Start with something like this and customize it for your site:

```css
/* Use small caps for abbreviations */
abbr {
  font-size: 0.875em;
  letter-spacing: 0.15em;
  margin-right: -0.15em;
}

/* Use the best available ampersand */
.amp {
  font-family: Baskerville, Constantia, Palatino, 'Palatino Linotype',
    'Book Antiqua', serif;
  font-style: italic;
}
```

## Installation

```bash
$ npm install --save richtypo
```

## JavaScript API

### Text processing: common use cases

```javascript
richtypo.rich(text, lang); // Enhancing typography: non-breaking spaces, abbreviations
richtypo.title(text, lang); // Typography for big text: the same as rich and ampersands
richtypo.lite(text, lang); // Simple typographer (quotes, em-dash, etc.) for user generated content (e.g. comments)
richtypo.full(text, lang); // lite() + rich()
```

- `text` is an HTML string;
- `lang` (_optional_) is a text language (`en` or `ru`, default: `en`).

### Text processing: custom set of rules

```javascript
richtypo.richtypo(text, rulesets, lang);
```

- `text` is a HTML string;
- `rulesets` is array of rulesets (available rulesets: `save_tags`, `cleanup_before`, `short_words`, `orphans`, `lite`, `rich`, `cleanup_after`, `restore_tags`, `remove_doppelgangers` or language-specific rules);
- `lang` (_optional_) is a text language (`en` or `ru`, default: `en`).

### Change language globally

```javascript
richtypo.lang(lang);
```

- `lang` is a language (`en` or `ru`).

### Convert to text

If you don’t want HTML tags in the result string, use `textify` method:

```javascript
richtypo.textify(richtypo.full(text, lang));
```

## Change log

The change log can be found on the [Releases page](https://github.com/sapegin/richtypo.js/releases).

---

## License

The MIT License, see the included [License.md](License.md) file.
