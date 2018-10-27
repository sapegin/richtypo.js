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

	if (rule.regex) {
		return text.replace(rule.regex, rule.replace);
	}

	let processedText = text;
	rule.forEach(r => (processedText = replace(processedText, r)));
	return processedText;
}

function run(rules, text) {
	const rulesArray = !Array.isArray(rules) ? [rules] : rules;
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

	rulesArray.forEach(rule => {
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
		.replace(/\xAF/gm, '<span style="white-space:nowrap">&thinsp;</span>')
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

function flatten(array, fn, ...args) {
	if (!Array.isArray(array)) return [array];

	return array.reduce((acc, el) => {
		if (Array.isArray(el)) {
			return [...acc, ...flatten(el, fn, ...args)];
		}

		return [...acc, ...flatten(fn ? fn(el, ...args) : el)];
	}, []);
}

export function compileRules({ rules, defs }) {
	const computedDefs = compileDefs(defs);
	const rulesets = {};

	// add negative lookbehind to make sure we're not in a tag
	function decorateRule(regex) {
		return `(?<!<[^>]*)${regex}`;
	}

	function compileRule(rule, name) {
		if (typeof rule === 'string') {
			if (!rulesets[rule]) {
				throw new Error(
					`Rule "${rule}" mentioned in "${name}" not found. Available rules: ` +
						Object.keys(rulesets).join(', ')
				);
			}
			return rulesets[rule];
		}

		// if obj is a function, then we compute it through defs
		rule = typeof rule === 'function' ? rule(computedDefs) : rule;

		// if at this point rule does not have a regex, then the rule is
		// a composition of other rules as in {rule1, rule2, rule3}
		if (!rule.regex) {
			return Object.entries(rule).map(([n, r]) => compileRule(r, n));
		}

		const result = {
			name,
			regex: new RegExp(decorateRule(rule.regex), rule.flags || 'gmi'),
			replace: rule.replace,
		};
		return result;
	}

	Object.entries(rules).forEach(([name, rule]) => {
		const compiledRule = !Array.isArray(rule)
			? flatten(compileRule(rule, name))
			: flatten(rule, compileRule, name);

		rulesets[name] = compiledRule;
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
