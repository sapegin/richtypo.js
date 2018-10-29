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

// This is a utility function that recursively flattens deeply nested arrays.
// it can accepts a action function as an argument that is run on plain elements
// of the array.

// This function is useful in case rules are nested composition of other rules
// i.e. ['space', [quotes, emdash]]

function flatten(array) {
	if (!Array.isArray(array)) {
		return [array];
	}

	return array.reduce((acc, el) => {
		if (Array.isArray(el)) {
			return [...acc, ...flatten(el)];
		}

		return [...acc, el];
	}, []);
}

/**
 * @param {(Object[]|Object)} rules
 * @param {string} text
 * @returns {string}
 */

function run(rules, text) {
	const rulesArray = flatten(rules);
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
		processedText = rule(processedText);
		// console.log(
		// 	'rule',
		// 	rule,
		// 	processedText.replace(/\xA0/g, '__').replace(/\xAF/g, '_')
		// );
	});

	processedText = processedText
		// transform hairspace in compatible html entity
		.replace(/\xAF/gm, '&#x202f;')
		// restoring HTML tags
		.replace(restoreTagsRe, (_, num) => savedTags[num])
		// Remove double tags, like <abbr><abbr>JS</abbr></abbr>
		.replace(/<abbr>(<\1>[^<]+<\/\1>)<\/\1>/g, '$2');

	return processedText;
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
