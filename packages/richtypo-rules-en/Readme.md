# Richtypo English Rule Package

The English rule package is built to enrich text with English typographic rules and conventions.

### Installation

```bash
npm install --save richtypo-rules-en
```

### The rules

The rules of this package include the `spaces`, `abbr`, `emdash`, `amp`, `ellipsis` rules that are directly imported from the [`richtypo-rules-common` package](https://github.com/sapegin/richtypo.js/packages/richtypo-rules-common).

It also includes the following customized rules:

- **`quotes`**: transforms straight double quotes into curly double quotes → `text in "quotes" → text in “quotes”`
- **`numbers`**: adds thousands separators to large numbers and put ordinals within `<sup>` tags → `10000.123, 1st 2nd 3rd → 10,000.123 1<sup>st</sup> 2<sup>nd</sup> 3<sup>rd</sup>`
- **`all`**: runs `spaces`, `quotes`, `abbr`, `numbers`, `emdash`, `ellipsis` rules in sequence.
