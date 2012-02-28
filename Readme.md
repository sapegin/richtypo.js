# Richtypo: typography enhancer for Node.js

The main purpose of this library is to enhance typography of your HTML. It supposes that your texts already have right
quotes, dashes and other symbols (you can use [Typography Keyboard Layout](http://ilyabirman.net/typography-layout/)).
Richtypo adds non-breaking spaces in right places, adds CSS classes for abbreviations, ampersands and hanging
punctuation for special styling.


## Features

- Rules for English and Russian languages
- Non-breaking spaces after prepositions and conjunctions, before em-dash, etc.
- `<nobr>` for words with hyphens
- CSS classes for abbreviations, ampersands and hanging punctuation
- Takes care of your HTML tags
- Simple typographer (quotes, em-dash, etc.) for user generated content (e.g. comments)


## Example

```javascript
var richtypo = require('richtypo');
var beatiful = richtypo.rich('Welcome to the world or beautiful web typography — only with Richtypo.');
var awesome = richtypo.title('Beautiful &amp; Awesome Web Typography with “Richtypo”');
```

Will produce something like that:

```html
Welcome to&nbsp;the world or&nbsp;beautiful web typography&nbsp;— only with Richtypo.
Beautiful <span class="amp">&amp;</span> Awesome Web Typography with <span class="slaquo"> </span> <span class="hlaquo">“</span>Richtypo”'
```


## Installation

```bash
$ npm install richtypo
```


## Usage / API

Richtypo has three functions for common use cases.

```javascript
richtypo.rich(text, lang)  // Enhancing typography: non-breaking spaces, abbreviations
richtypo.title(text, lang)  // Typography for big text: the same as rich + ampersands and hanging punctuation
richtypo.lite(text, lang)  // Simple typographer (quotes, em-dash, etc.) for user generated content (e.g. comments)
```

Where
- `text` is an HTML string;
- `lang` (_optional_) is a text language (`'en'` or `'ru'`).

But you can use any set of rules if you are kinda control freak:

```javascript
richtypo.richtypo(text, rulesets, lang)
```

Where
- `text` is a HTML string;
- `rulesets` is array of rulesets (available rulesets: `'save_tags'`, `'cleanup_before'`, `'spaces_lite'`, `'spaces_lite'`,
- `'spaces'`, `'abbrs'`, `'amps'`, `'hanging'`, `'cleanup_after'`, `'restore_tags'`);
`lang` (_optional_) is a text language (`'en'` or `'ru'`).

Change language globally:

```javascript
richtypo.lang(lang)
```

Where
- `lang` is a language (`'en'` or `'ru'`).



---

## License 

(The MIT License)

Copyright © 2012 Artem Sapegin, artem@sapegin.ru, http://sapegin.me

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
