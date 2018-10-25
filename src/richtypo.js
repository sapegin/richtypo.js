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

class RichTypo {
	constructor(text, processedText) {
		this.text = text;
		this.processedText = processedText;
	}

	html() {
		// transform hairspace in html entity
		return this.processedText.replace(/\xAF/gm, '&#x202F;');
	}

	raw() {
		return this.processedText;
	}

	string() {
		// textify
		return this.processedText
			.replace(/<\/?[^>]+>/g, '') // Remove tags
			.replace(/&mdash;/g, '—')
			.replace(/[\x20\xA0]{2,}/g, ' '); // Repeated spaces [normal space + nbsp]
	}
}

function replace(text, rules) {
	let processedText = text;
	rules.forEach(rule => {
		if (Array.isArray(rule[0])) {
			processedText = replace(processedText, rule);
		} else {
			processedText = processedText.replace(rule[0], rule[1]);
		}
	});
	return processedText;
}

function run(text, rulesets, rules) {
	let processedText = text;
	const rulesetArray = !Array.isArray(rulesets) ? [rulesets] : rulesets;

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

	rulesetArray.forEach(rulename => {
		const rule = rules[rulename];
		if (typeof rule === 'function') {
			processedText = rule(processedText);
		} else if (rule) {
			processedText = replace(processedText, rule);
		}
		// console.log(
		//   'rule',
		//   rulename,
		//   processedText.replace(/\xA0/g, '__').replace(/\xAF/g, '_')
		// );
	});

	// restoring tags
	processedText = processedText
		.replace(restoreTagsRe, (_, num) => savedTags[num])
		// Remove double tags, like <abbr><abbr>JS</abbr></abbr>
		.replace(/<abbr>(<\1>[^<]+<\/\1>)<\/\1>/g, '$2');

	return new RichTypo(text, processedText);
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

	const rulesets = {};

	// add negative lookbehind to make sure we're not in a tag
	function decorateRule(regex) {
		return `(?<!<[^>]*)${regex}`;
	}

	function compileRule(obj, name) {
		if (typeof obj === 'string') {
			if (!rulesets[obj]) {
				throw new Error(
					`Rule "${obj}" mentioned in "${name}" not found. Available rules: ${Object.keys(
						rulesets
					).join(', ')}`
				);
			}
			return rulesets[obj];
		}

		// if obj is a function, then we compute it through defs
		const rule = typeof obj === 'function' ? obj(computedDefs) : obj;
		return [
			new RegExp(decorateRule(rule.regex), rule.flags || 'gmi'),
			rule.result,
		];
	}

	Object.entries(rules).forEach(([name, rule]) => {
		let ruleArray = !Array.isArray(rule) ? [rule] : rule;

		ruleArray = ruleArray.map(r => compileRule(r, name));
		rulesets[name] = ruleArray;
	});

	// console.log('RULESETS', rulesets);

	return rulesets;
}

const richtypo = (rules, rulename) => {
	if (rulename) {
		return text => run(text, rulename, rules);
	}

	const rt = (rulename, text) => run(text, rulename, rules);
	rt.all = text => run(text, Object.keys(rules), rules);

	return rt;
};

export default richtypo;
