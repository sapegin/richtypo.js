# Richtypo: typography enhancer for Node.js

[![Build Status](https://travis-ci.org/sapegin/richtypo.js.svg)](https://travis-ci.org/sapegin/richtypo.js)

The main purpose of this library is to enhance typography of your HTML. It supposes that your texts already have right quotes, dashes and other symbols (you can use [Typography Keyboard Layout](http://ilyabirman.net/typography-layout/)). Richtypo adds non-breaking spaces in right places, CSS classes for abbreviations, ampersands and hanging punctuation for special styling.


## Features

- Rules for English and Russian languages
- Non-breaking spaces after prepositions and conjunctions, before em-dash, etc.
- `<nobr>` for words with hyphens
- CSS classes for abbreviations, ampersands and hanging punctuation
- Takes care of your HTML tags
- Simple typographer (quotes, em-dash, etc.) for user generated content (e.g. comments)


## Example

[Try it out!](https://tonicdev.com/npm/richtypo)

```javascript
var richtypo = require('richtypo');
var beautiful = richtypo.rich('Welcome to the world of beautiful web typography — only with Richtypo.');
var awesome = richtypo.title('Beautiful &amp; Awesome Web Typography with “Richtypo”');
```

Will produce something like that:

```html
Welcome to&nbsp;the world of&nbsp;beautiful web typography&nbsp;— only with Richtypo.
Beautiful <span class="amp">&amp;</span> Awesome Web Typography with <span class="sldquo"> </span> <span class="hldquo">“</span>Richtypo”'
```

`&nbsp;` is shown here just for demonstration purposes. Actual implementation produces the non-breaking space character itself (`\xA0`), not the escaped sequence.

Also look at [the example page](http://sapegin.github.io/richtypo.js/) and [its source](https://github.com/sapegin/richtypo.js/tree/master/example).


## Styles

Richtypo wraps abbreviations in `<abbr>` tags. It also wraps ampersands and leading quotes to allow for typographic enhancement:

| Character | Spacer class | Character class |
| --------- | ------------ | --------------- |
| `&` |           | `.amp`    |
| `“` | `.sldquo` | `.hldquo` |
| `‘` | `.slsquo` | `.hlsquo` |
| `«` | `.slaquo` | `.hlaquo` |
| `„` | `.sbdquo` | `.hbdquo` |
| `(` | `.sbrace` | `.hbrace` |

Start with something like this, and customize it for your site:

```css
/* Use small caps for abbreviations */
abbr {
  font-size: 0.875em;
  letter-spacing: 0.15em;
  margin-right: -0.15em;
}

/* Use the best available ampersand */
.amp {
  font-family: Baskerville, Constantia, Palatino, 'Palatino Linotype', 'Book Antiqua', serif;
  font-style: italic;
}

/* Hang leading braces and quotes into the left margin */
.sbrace { margin-right: 0.3em;  }
.hbrace { margin-left: -0.3em;  }

.slaquo { margin-right: 0.42em; }
.hlaquo { margin-left: -0.42em; }

.sbdquo { margin-right: 0.42em; }
.hbdquo { margin-left: -0.42em; }

.sldquo { margin-right: 0.42em; }
.hldquo { margin-left: -0.42em; }

.slsquo { margin-right: 0.42em; }
.hlsquo { margin-left: -0.42em; }
```


## Installation

```bash
$ npm install [-g] richtypo
```


## JavaScript API

### Text processing: common use cases

```javascript
richtypo.rich(text, lang)  // Enhancing typography: non-breaking spaces, abbreviations
richtypo.title(text, lang)  // Typography for big text: the same as rich + ampersands and hanging punctuation
richtypo.lite(text, lang)  // Simple typographer (quotes, em-dash, etc.) for user generated content (e.g. comments)
richtypo.full(text, lang)  // lite() + rich()
```

- `text` is an HTML string;
- `lang` (*optional*) is a text language (`en` or `ru`, default: `en`).

### Text processing: custom set of rules

```javascript
richtypo.richtypo(text, rulesets, lang)
```

- `text` is a HTML string;
- `rulesets` is array of rulesets (available rulesets: `save_tags`, `cleanup_before`, `short_words`, `spaces_lite`, `spaces`, `abbrs`, `amps`, `hanging`, `cleanup_after`, `restore_tags`);
- `lang` (*optional*) is a text language (`en` or `ru`, default: `en`).

### Change language globally

```javascript
richtypo.lang(lang)
```

- `lang` is a language (`en` or `ru`).

### Convert to text

If you don’t want HTML tags in the result string just wrap it in `textify` method:

```javascript
richtypo.textify(richtypo.full(text, lang))
```


## Command line

Usage: `richtypo [--rules full] [--lang en] [--text] filename`

### Options

#### `--rules RULESET` (default: `full`)

Define ruleset:

- lite - Simple typographer (quotes, em-dash, etc.) for user generated content (e.g. comments);

- rich - Enhancing typography: non-breaking spaces, abbreviations;

- title - Typography for big text: the same as --rich + ampersands and hanging punctuation.  [default: "full"]

- full - --light + --rich;

#### `--lang LANG` (default `en`)

Text language: `en` or `ru`.

#### `--text`

Convert result to text.

## Changelog

The changelog can be found on the [Releases page](https://github.com/sapegin/richtypo.js/releases).


---

## License

The MIT License, see the included [License.md](License.md) file.
