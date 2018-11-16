# Richtypo French typography rules

The French typography rules for [Richtypo](https://github.com/sapegin/richtypo.js).

### Installation

```bash
npm install --save richtypo-rules-fr
```

### The rules

The rules of this package include the `spaces`, `abbr`, `emdash`, `amp`, `ellipsis` rules that are directly imported from the [`richtypo-rules-common` package](https://github.com/sapegin/richtypo.js/packages/richtypo-rules-common).

_For better readability, the non-breaking space symbol `&nbsp;` is replaced with two underscores `__` and the narrow non-breaking space symbol `&#x202f;` with a single underscore `_`\_

| Rule                   | Description                                                                                       | Input                                            | Output                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------- |
| **`quotes`**           | transforms straight double quotes into double angle quotes                                        | `texte entre "guillemets"`                       | `texte entre «guillemets»`                           |
| **`numberOrdinals`**   | put ordinals within `<sup>` tags                                                                  | `1er 2nd 3èmes`                                  | `<sup>er</sup> 2<sup>nd</sup> 3<sup>èmes`            |
| **`numberSeparators`** | adds thousands separators to large numbers                                                        | `10000,123`                                      | `10__000,123`                                        |
| **`punctuation`**      | adds narrow non-breaking space before or after punctuation as it is the rule in French typography | `Ceci ? est: un «texte» avec de la ponctuation!` | `Ceci_? est_: un «_texte_» avec de la ponctuation_!` |
| **`recommended`**      | runs all rules except `numberOrdinals` and `numberSeparators`                                     |                                                  |                                                      |
