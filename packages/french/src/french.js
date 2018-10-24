import { defaultRuleset } from 'richtypo';

const {
  defs,
  rules: { numbers, quotes, spaces, emdash }
} = defaultRuleset;

const frenchDefs = Object.assign({}, defs, {
  ordinals: '(?:ème|er|ère|nd)s?',
  decimalsSeparator: '[.,]',
  openingQuote: '«',
  closingQuote: '»',
  thousandsSeparator: ({ nbsp }) => nbsp
});

export default {
  defs: frenchDefs,
  rules: {
    quotes,
    numbers,
    emdash,
    spaces,
    thinSpace: [
      ({ space, semicolon, hairspace }) => ({
        regex: `(?:${space}+)?([\\?!:»]|${semicolon})`,
        result: `${hairspace}$1`
      }),
      ({ space, hairspace }) => ({
        regex: `(«)(?:${space}+)?`,
        result: `$1${hairspace}`
      })
    ]
  }
};
