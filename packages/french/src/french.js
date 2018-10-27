import { defaultRuleset, compileRules } from 'richtypo';

const {
	defs,
	rules: { numbers, quotes, spaces, emdash },
} = defaultRuleset;

const frenchDefs = Object.assign({}, defs, {
	ordinals: '(?:ème|er|ère|nd)s?',
	decimalsSeparator: '[.,]',
	openingQuote: '«',
	closingQuote: '»',
	thousandsSeparator: ({ nbsp }) => nbsp,
});

const punctuation = [
	({ space, semicolon, hairspace }) => ({
		regex: `(?:${space}+)?([\\?!:»]|${semicolon})`,
		replace: `${hairspace}$1`,
	}),
	({ space, hairspace }) => ({
		regex: `(«)(?:${space}+)?`,
		replace: `$1${hairspace}`,
	}),
];

const ruleset = {
	defs: frenchDefs,
	rules: {
		quotes,
		numbers,
		emdash,
		spaces,
		punctuation,
		all: ['quotes', 'numbers', 'emdash', 'spaces', 'punctuation'],
	},
};

export default compileRules(ruleset);
