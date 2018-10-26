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

export default compileRules({
	defs: defaultRuleset.defs,
	rules: {
		spaces,
		quotes,
		abbr,
		numbers,
		emdash,
		ellipsis,
		amp,
		all: [spaces, quotes, abbr, numbers, emdash, ellipsis, amp],
	},
});
