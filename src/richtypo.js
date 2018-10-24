import * as common from './common.js';
const { defs, ...rules } = common;

export const defaultRuleset = { defs, rules };

const cleanupRules = {
	cleanup_before: [
		// Remove repeated spaces
		[/ {2,}/g, ' '],
	],

	cleanup_after: [
		// Non-breaking space entity to symbol
		[/&nbsp;/g, '\xA0'],
	],

	textify: [
		[/<\/?[^>]+>/g, ''], // Remove tags
		[/&mdash;/g, '—'],
		[/[\x20\xA0]{2,}/g, ' '], // Repeated spaces [normal space + nbsp]
	],
};

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

const richtypo = ({ defs, rules }, rule) => {
	const computedDefs = _computeDefs(defs);
	const computedRules = Object.assign(
		{},
		cleanupRules,
		_compileRules(rules, computedDefs)
	);
	if (rule) {
		return text =>
			_process(text, ['cleanup_before', rule, 'cleanup_after'], computedRules);
	}
	return (rule, text) =>
		_process(text, ['cleanup_before', rule, 'cleanup_after'], computedRules);
};

export default richtypo;

// all(text) {
// 	return this._process(text, Object.keys(this.rules));
// }

function _process(text, rulesets, rules) {
	if (!Array.isArray(rulesets)) {
		rulesets = [rulesets];
	}

	const savedTags = [];

	function saveTags(text) {
		let savedTagsNum = 0;

		function save(s) {
			savedTags[savedTagsNum] = s;
			return `<${savedTagsNum++}>`;
		}

		for (let reIdx = 0; reIdx < saveTagsRe.length; reIdx++) {
			text = text.replace(saveTagsRe[reIdx], save);
		}
		return text;
	}

	function restoreTags(text) {
		text = text.replace(restoreTagsRe, (_, num) => savedTags[num]);
		// Remove double tags, like <abbr><abbr>JS</abbr></abbr>
		return text.replace(/<(nobr|abbr)>(<\1>[^<]+<\/\1>)<\/\1>/g, '$2');
	}

	text = saveTags(text);

	for (let setIdx = 0; setIdx < rulesets.length; setIdx++) {
		const rulesetId = rulesets[setIdx];
		const rule = rules[rulesetId];
		if (typeof rule === 'function') {
			text = rule(text);
		} else if (rule) {
			text = _replace(text, rule);
		}
		// console.log(
		// 	'rule',
		// 	rulesetId,
		// 	text.replace(/\xA0/g, '__').replace(/\xAF/g, '_')
		// );
	}

	text = restoreTags(text);

	return text;
}

function _replace(text, rules) {
	for (let ruleIdx = 0; ruleIdx < rules.length; ruleIdx++) {
		const rule = rules[ruleIdx];
		if (Array.isArray(rule[0])) {
			text = _replace(text, rule);
		} else {
			text = text.replace(rule[0], rule[1]);
		}
	}
	return text;
}

function _computeDefs(defs) {
	// defs can be functions of other defs, so
	// we iterate through defs to compute them
	// based on previous key values.
	// This is not a super clear comment.

	const computedDefs = {};
	Object.entries(defs).map(([key, value]) => {
		if (typeof value === 'function') {
			computedDefs[key] = value(computedDefs);
		} else {
			computedDefs[key] = value;
		}
	});

	return computedDefs;
}

function _compileRules(ruleset, defs) {
	function compileRule(obj, name) {
		if (typeof obj === 'string') {
			if (!rulesets[obj]) {
				throw new Error(
					`Rule "${obj}" mentioned in "${name}" not found. Available rules: ` +
						Object.keys(rulesets).join(', ')
				);
			}
			return rulesets[obj];
		}

		// if obj is a function, then we compute it through defs
		const rule = typeof obj === 'function' ? obj(defs) : obj;
		return [new RegExp(rule.regex, rule.flags || 'gmi'), rule.result];
	}

	const rulesets = {};
	for (const name in ruleset) {
		let rule = ruleset[name];

		if (!Array.isArray(rule)) {
			rule = [rule];
		}

		rule = rule.map(r => compileRule(r, name));
		rulesets[name] = rule;
	}

	// console.log('RULESETS', rulesets);

	return rulesets;
}
