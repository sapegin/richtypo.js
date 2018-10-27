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

/**
 * @param {string} text
 * @param {(Object[]|Function|Object)} rule
 * @returns {string}
 */

function replace(text, rule) {
	// if rule is an array then we iterate through all its inner rules
	if (Array.isArray(rule)) {
		let processedText = text;
		rule.forEach(r => (processedText = replace(processedText, r)));
		return processedText;
	}

	// if rule is a function, we just run it
	if (typeof rule === 'function') {
		return rule(text);
	}

	// if rule is an object with the regex field
	// we run it through native String.prototype.replace
	if (rule.regex) {
		return text.replace(rule.regex, rule.replace);
	}

	// if it's none of the above then there's probably an error with the rule
	throw new Error(`There probably an error with the rule ${rule}`);
}

/**
 * @param {(Object[]|Object)} rules
 * @param {string} text
 * @returns {string}
 */

function run(rules, text) {
	const rulesArray = !Array.isArray(rules) ? [rules] : rules;
	let processedText = text;

	const savedTags = [];

	// saving HTML tags
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

	// iterating through all rules of rulesArray
	rulesArray.forEach(rule => {
		processedText = replace(processedText, rule);
		// console.log(
		// 	'rule',
		// 	rule,
		// 	processedText.replace(/\xA0/g, '__').replace(/\xAF/g, '_')
		// );
	});

	processedText = processedText
		// transform hairspace in compatible html entity
		.replace(/\xAF/gm, '<span style="white-space:nowrap">&thinsp;</span>')
		// restoring HTML tags
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

	Object.entries(defs).forEach(([key, def]) => {
		// if def is a function, then it's we run it with
		// previously computedDefs as its argument
		if (typeof def === 'function') {
			computedDefs[key] = def(computedDefs);
		}
		// otherwise we just assign it to computedDefs
		else {
			computedDefs[key] = def;
		}
	});

	return computedDefs;
}

// This is a utility function that recursively flattens deeply nested arrays.
// it can accepts a action function as an argument that is run on plain elements
// of the array.

// This function is useful in case rules are nested composition of other rules
// i.e. ['space', [quotes, emdash]]

function flatten(array, fn, ...args) {
	if (!Array.isArray(array)) return [array];

	return array.reduce((acc, el) => {
		if (Array.isArray(el)) {
			return [...acc, ...flatten(el, fn, ...args)];
		}

		return [...acc, ...flatten(fn ? fn(el, ...args) : el)];
	}, []);
}

/**
 * Compiles a ruleset that includes defs and rules.
 * Defs can be functions of each other, and rules can be functions
 * of Defs. The returned value is a keyed value object with the key
 * being the name of the rule and the value an array of RegExp to run through
 * @param {Object} rules
 * @param {Object} defs
 * @returns {Object}
 */

export function compileRules({ rules, defs = {} }) {
	const computedDefs = compileDefs(defs);
	const rulesets = {};

	// We add a negative lookbehind to make sure we're not running
	// the rule within an HTML tag
	function decorateRule(regex) {
		return `(?<!<[^>]*)${regex}`;
	}

	function compileRule(rule, name) {
		// if the rule is a string then we just return the previously
		// compiled rule.
		if (typeof rule === 'string') {
			if (!rulesets[rule]) {
				throw new Error(
					`Rule "${rule}" mentioned in "${name}" not found. Available rules: ` +
						Object.keys(rulesets).join(', ')
				);
			}
			return rulesets[rule];
		}

		// if the rule is a function, then we compute it through defs
		rule = typeof rule === 'function' ? rule(computedDefs) : rule;

		// if at this point the rule does not have a regex attribute, then the rule is
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

	// We iterate throught the rules to compile each of them
	Object.entries(rules).forEach(([name, rule]) => {
		const compiledRule = !Array.isArray(rule)
			? flatten(compileRule(rule, name))
			: flatten(rule, compileRule, name);

		rulesets[name] = compiledRule;
	});

	return rulesets;
}

/**
 * @param {Object} rules
 * @param {string} test
 * @returns {Function}
 */

const richtypo = (rules, text) => {
	if (text) {
		return run(rules, text);
	}

	return text => run(rules, text);
};

export default richtypo;
