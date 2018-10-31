# Richtypo French Rule Package

The French rule package is built to enrich text with French typographic rules and conventions.

### Installation

```bash
npm install --save richtypo-rules-fr
```

### The rules

The rules of this package include the `spaces`, `abbr`, `emdash`, `amp`, `ellipsis` rules that are directly imported from the [`richtypo-rules-common` package](https://github.com/sapegin/richtypo.js/packages/richtypo-rules-common).

It also includes the following customized rules:

_For better readability, the non-breaking space symbol `&nbsp;` is replaced with two underscores `__` and the narrow non-breaking space symbol `&#x202f;` with a single underscore `_`\_

- **`quotes`**: transforms straight double quotes into double angle quotes → `texte entre "guillements" → texte entre «guillemets»`
- **`numbers`**: adds thousands separators to large numbers and put ordinals within `<sup>` tags → `10000,123, 1er 2ème 3èmes → 10 000,123 1<sup>er</sup> 2<sup>ème</sup> 3<sup>èmes</sup>`
- **`punctuation`**: adds narrow non-breaking space before or after punctuation as it is the rule in French typography → `Ceci ? est: un «texte» avec de la ponctuation! → Ceci_? est_: un «_texte_» avec de la ponctuation_!`
- **`all`**: runs `spaces`, `quotes`, `abbr`, `numbers`, `emdash`, `ellipsis`, `punctuation` rules in sequence.