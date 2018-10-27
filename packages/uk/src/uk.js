import { defaultRuleset, compileRules } from 'richtypo';

const {
	spaces,
	quotes,
	abbr,
	numbers,
	amp,
	emdash,
	ellipsis,
} = defaultRuleset.rules;

const rules = compileRules({
	defs: defaultRuleset.defs,
	rules: {
		spaces,
		quotes,
		abbr,
		numbers,
		emdash,
		ellipsis,
		amp,
		all: ['spaces', 'quotes', 'abbr', 'numbers', 'emdash', 'ellipsis', 'amp'],
	},
});

export default rules;
