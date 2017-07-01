// @ts-check
'use strict';

/*
\x20 - regular space
\xA0 - non-breaking space
*/

const _ = require('lodash');

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
const commonDefs = {
	nbsp: '\xA0',
	hairspace: '&#8202;',
};
const shortWordsRegExp = [/(^|[\x20\xA0(>«”„])([а-яёa-zA-ZА-ЯЁ][а-яёa-z]?)\x20/g, '$1$2\xA0'];

const rules = {};
let currentLang = 'en';
let savedTagsNum;
let savedTags;

const commonRules = {
	cleanup_before: [
		// Remove repeated spaces
		[/ {2,}/g, ' '],
	],
	cleanup_after: [
		// Non-breaking space entinty to symbol
		[/&nbsp;/g, '\xA0'],
	],
	// Remove dobule tags, like <abbr><abbr>JS</abbr></abbr>
	remove_doppelgangers: [[/<(nobr|abbr)>(<\1>[^<]+<\/\1>)<\/\1>/g, '$2']],
	// Non-breaking space after short words
	short_words: [
		// Run twice to catch pairs of short words: of_a_book
		shortWordsRegExp,
		shortWordsRegExp,
	],
	// Orphans (non-breaking space before the last word)
	orphans: [[/\s([^\s<]{1,10}(?:\n\n|$))/g, '\xA0$1']],
	// Hanging punctuation
	_hanging_table: {
		'«': 'laquo',
		'„': 'bdquo',
		'“': 'ldquo',
		'‘': 'lsquo',
		'(': 'brace',
	},
	hanging: [
		[
			/(^|\s|>)([«„“‘(])/g,
			function(s, prefix, symbol) {
				const name = commonRules._hanging_table[symbol];
				const html =
					[' ', '\xA0', '\n', '\r', '\t'].indexOf(prefix) !== -1
						? '<span class="s' + name + '"> </span> '
						: prefix;
				return html + '<span class="h' + name + '">' + symbol + '</span>';
			},
		],
	],
	textify: [
		[/<\/?[^>]+>/g, ''], // Remove tags
		[/&mdash;/g, '—'],
		[/[\x20\xA0]{2,}/g, ' '], // Repeated spaces [normal space + nbsp]
	],

	save_tags(text) {
		function save(s) {
			savedTags[savedTagsNum] = s;
			return '<' + savedTagsNum++ + '>';
		}

		savedTagsNum = 0;
		savedTags = [];
		for (let reIdx = 0; reIdx < saveTagsRe.length; reIdx++) {
			text = text.replace(saveTagsRe[reIdx], save);
		}
		return text;
	},

	restore_tags(text) {
		text = text.replace(restoreTagsRe, function(s, num) {
			return savedTags[num];
		});
		savedTagsNum = 0;
		savedTags = [];
		return text;
	},
};

const richtypo = {};

/**
 * @param {string} lang
 * @returns {string}
 */
richtypo.lang = function(lang) {
	if (lang !== undefined) {
		currentLang = lang;
	}
	return currentLang;
};

/**
 * @param {string} text
 * @param {string} [lang]
 * @return {string}
 */
richtypo.lite = function(text, lang) {
	return _process(text, lang, [
		'save_tags',
		'cleanup_before',
		'lite',
		'spaces_lite',
		'quotes',
		'cleanup_after',
		'restore_tags',
		'remove_doppelgangers',
	]);
};

/**
 * @param {string} text
 * @param {string} [lang]
 * @return {string}
 */
richtypo.rich = function(text, lang) {
	return _process(text, lang, [
		'save_tags',
		'cleanup_before',
		'short_words',
		'orphans',
		'spaces_lite',
		'spaces',
		'abbr',
		'cleanup_after',
		'restore_tags',
		'remove_doppelgangers',
	]);
};

/**
 * @param {string} text
 * @param {string} [lang]
 * @return {string}
 */
richtypo.title = function(text, lang) {
	return _process(text, lang, [
		'save_tags',
		'cleanup_before',
		'short_words',
		'orphans',
		'spaces_lite',
		'spaces',
		'abbr',
		'amp',
		'hanging',
		'cleanup_after',
		'restore_tags',
		'remove_doppelgangers',
	]);
};

/**
 * @param {string} text
 * @param {string} [lang]
 * @return {string}
 */
richtypo.full = function(text, lang) {
	return _process(text, lang, [
		'save_tags',
		'cleanup_before',
		'lite',
		'spaces_lite',
		'spaces',
		'quotes',
		'abbr',
		'amp',
		'hanging',
		'cleanup_after',
		'restore_tags',
		'remove_doppelgangers',
	]);
};

/**
 * @param {string} text
 * @param {string} [lang]
 * @return {string}
 */
richtypo.textify = function(text, lang) {
	return _process(text, lang, ['textify']);
};

/**
 * @param {string} text
 * @param {string[]} rulesets
 * @param {string} [lang]
 * @return {string}
 */
richtypo.richtypo = function(text, rulesets, lang) {
	return _process(text, lang, rulesets);
};

function _process(text, lang, rulesets) {
	if (lang === undefined) {
		lang = richtypo.lang();
	}
	if (!Array.isArray(rulesets)) {
		rulesets = [rulesets];
	}

	const langRules = _getRules(lang);
	if (!langRules) {
		return text;
	}

	for (let setIdx = 0; setIdx < rulesets.length; setIdx++) {
		const rulesetId = rulesets[setIdx];
		const rule = langRules[rulesetId];
		if (_.isFunction(rule)) {
			text = rule(text);
		} else if (rule) {
			text = _replace(text, rule);
		}
	}

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

function _compile(json) {
	const defs = Object.assign({}, commonDefs, json.defs);
	function compileRule(obj) {
		if (_.isString(obj)) {
			return rulesets[obj];
		}

		return [new RegExp(_tmpl(obj.regex, defs), obj.flags || 'gi'), _tmpl(obj.result, defs)];
	}

	const rulesets = {};
	for (const name in json.rules) {
		let rule = json.rules[name];
		if (!Array.isArray(rule)) {
			rule = [rule];
		}

		rule = rule.map(compileRule);
		rulesets[name] = rule;
	}

	return rulesets;
}

function _tmpl(template, data) {
	return template.replace(/\$\(([^)]+)\)/g, function tmplReplace(m, key) {
		return data[key] || '';
	});
}

function _getRules(lang) {
	if (!rules[lang]) {
		let langRules = {};
		try {
			langRules = require('./rules/' + lang + '.json');
		} catch (err) {
			throw new Error('Cannot load rules for language + ' + currentLang + '\n');
		}
		langRules = _compile(langRules);
		rules[lang] = Object.assign({}, commonRules, langRules);
	}
	return rules[lang];
}

module.exports = richtypo;
