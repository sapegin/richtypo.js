# How to contribute

Bug fixes are welcome, but not new features. [See more details](https://github.com/sapegin/richtypo.js/discussions/63).

## Development workflow

Install dependencies first:

```bash
npm install
npm run bootstrap
```

Run linters and tests:

```bash
npm test
```

Or run tests in watch mode:

```bash
npm run test:watch
```

To update Jest snapshots:

```bash
npm run test:jest -- -u
```
