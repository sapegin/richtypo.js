import * as common from './common';

const { defs: defaultDefs, ...defaultRules } = common;

export const defaultRuleset = { defs: defaultDefs, rules: defaultRules };

// const cleanupRules = {

//   textify: [
//     [/<\/?[^>]+>/g, ''], // Remove tags
//     [/&mdash;/g, '—'],
//     [/[\x20\xA0]{2,}/g, ' '] // Repeated spaces [normal space + nbsp]
//   ]
// };

const saveTagsRe = [
	/<!(--\[[^\]>]+\]|\[[^\]>]+\]--)>/gim,
	/<!--[\s\S]*?-->/gim,
	/<pre[^>]*>[\s\S]*?<\/pre>/gim,
	/<style[^>]*>[\s\S]*?<\/style>/gim,
	/<script[^>]*>[\s\S]*?<\/script>/gim,
	/<code[^>]*>[\s\S]*?<\/code>/gim,
	/<[a-z/][^>]*>/gim,
];

const restoreTagsRe = /<(\d+)>/g;

function replace(text, rule) {
	if (typeof rule === 'function') {
		return rule(text);
	}

	if (rule[0] instanceof RegExp) {
		return text.replace(rule[0], rule[1]);
	}

	let processedText = text;
	rule.forEach(r => (processedText = replace(processedText, r)));
	return processedText;
}

function run(rules, text) {
	let processedText = text;

	const savedTags = [];

	// saving tags
	let savedTagsNum = 0;

	function save(tag) {
		savedTags[savedTagsNum] = tag;
		// rTag is <0>, <1>, <2>
		const rTag = `<${savedTagsNum}>`;
		savedTagsNum += 1;
		return rTag;
	}

	saveTagsRe.forEach(regex => {
		processedText = processedText.replace(regex, save);
	});

	// end of saving tags

	// Remove repeated spaces
	processedText = processedText.replace(/ {2,}/gm, ' ');

	rules.forEach(rule => {
		processedText = replace(processedText, rule);
		// console.log(
		// 	'rule',
		// 	rule,
		// 	processedText.replace(/\xA0/g, '__').replace(/\xAF/g, '_')
		// );
	});

	// restoring tags
	processedText = processedText
		// transform hairspace in html entity
		.replace(/\xAF/gm, '&#x202F;')
		.replace(restoreTagsRe, (_, num) => savedTags[num])
		// Remove double tags, like <abbr><abbr>JS</abbr></abbr>
		.replace(/<abbr>(<\1>[^<]+<\/\1>)<\/\1>/g, '$2');

	return processedText;
}

function compileDefs(defs) {
	// defs can be functions of other defs, so
	// we iterate through defs to compute them
	// based on previous key values.
	// This is not a super clear comment.

	const computedDefs = {};
	Object.entries(defs).forEach(([key, value]) => {
		if (typeof value === 'function') {
			computedDefs[key] = value(computedDefs);
		} else {
			computedDefs[key] = value;
		}
	});

	return computedDefs;
}

export function compileRules({ rules, defs }) {
	const computedDefs = compileDefs(defs);

	// add negative lookbehind to make sure we're not in a tag
	function decorateRule(regex) {
		return `(?<!<[^>]*)${regex}`;
	}

	function compileRule(rule) {
		// if obj is a function, then we compute it through defs
		rule = typeof rule === 'function' ? rule(computedDefs) : rule;
		const result = [
			new RegExp(decorateRule(rule.regex), rule.flags || 'gmi'),
			rule.result,
		];
		return result;
	}

	const rulesets = {};

	function compileRuleArray(rules) {
		return rules.reduce((acc, rule) => {
			if (Array.isArray(rule)) {
				return [...acc, ...compileRuleArray(rule)];
			}
			return [...acc, compileRule(rule)];
		}, []);
	}

	Object.entries(rules).forEach(([name, rule]) => {
		let ruleArray = !Array.isArray(rule) ? [rule] : rule;

		ruleArray = compileRuleArray(ruleArray);

		// ruleArray = ruleArray.map(r => compileRule(r, name));
		rulesets[name] = ruleArray;
	});

	return rulesets;
}

const richtypo = (rules, text) => {
	if (text) {
		return run(rules, text);
	}

	return text => run(rules, text);
	//rt.all = text => run(text, Object.keys(rules), rules);
};

export default richtypo;
