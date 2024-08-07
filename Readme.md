# Richtypo: HTML and Markdown typography enhancer for Node.js

[![npm](https://img.shields.io/npm/v/richtypo.svg)](https://www.npmjs.com/package/richtypo) [![Codecov](https://codecov.io/gh/sapegin/richtypo.js/branch/master/graph/badge.svg)](https://codecov.io/gh/sapegin/richtypo.js) [![Node.js CI status](https://github.com/sapegin/richtypo.js/workflows/Node.js%20CI/badge.svg)](https://github.com/sapegin/richtypo.js/actions)

Richtypo prepares your texts to publication by improving typography, like fancy quotes (`"` → `“”`), dashes (`-` → `—`), and adding non-breaking spaces to make the text prettier and more readable by avoiding undesired line breaks.

Richtypo comes with [typography rules](docs/Readme.md#rules) for English, French, and Russian, and you can customize them and create your own rules — each rule is an independent JavaScript function.

Have a look at [the example page](https://sapegin.github.io/richtypo.js/) and [its source](https://github.com/sapegin/richtypo.js/tree/master/example/src).

## Features

- Works with plain text, Markdown, or HTML
- Uses Unicode characters, doesn’t add any HTML markup by default
- Takes care of your HTML tags
- English, French, and Russian rules
- Run the recommended rules or cherry pick the ones you need
- Add your own rules
- Works on the server and in the browser
- No dependencies

## Documentation

[Read the docs](docs/Readme.md).

## Changelog

The changelog can be found on the [Releases page](https://github.com/sapegin/richtypo.js/releases).

## Contributing

Bug fixes are welcome, but not new features. Please take a moment to review the [contributing guidelines](Contributing.md).

## Sponsoring

This software has been developed with lots of coffee, buy me one more cup to keep it going.

<a href="https://www.buymeacoffee.com/sapegin" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/lato-orange.png" alt="Buy Me A Coffee" height="51" width="217" ></a>

## Authors and license

[Artem Sapegin](https://sapegin.me) and [contributors](https://github.com/sapegin/richtypo.js/graphs/contributors).

MIT License, see the included [License.md](License.md) file. Also see the [project status](https://github.com/sapegin/richtypo.js/discussions/63).
