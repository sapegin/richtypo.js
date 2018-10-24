import { defaultRuleset } from 'richtypo';

const {
	defs,
	rules: { numbers, quotes, spaces },
} = defaultRuleset;

const frenchDefs = Object.assign({}, defs, {
	ordinals: '(?:ème|er|ère|nd)s?',
	decimalsSeparator: '[.,]',
	openingQuote: '«',
	closingQuote: '»',
	thousandsSeparator: ({ nbsp }) => nbsp,
});

export default {
	defs: frenchDefs,
	rules: {
		thinSpace: [
			({ space, semicolon, hairspace }) => ({
				regex: `(?:${space}+)?([\\?!:\\xbb]|${semicolon})`,
				result: `${hairspace}$1`,
			}),
			({ space, hairspace }) => ({
				regex: `(\\xab)(?:${space}+)?`,
				result: `$1${hairspace}`,
			}),
		],
		quotes,
		numbers,
		spaces,
	},
};
