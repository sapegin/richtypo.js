/**
 * Richtypo
 * Typography enhancer for Node.js
 *
 * @author Artem Sapegin
 * @copyright 2012 Artem Sapegin (sapegin.me)
 * @license MIT
 */

 /*
  \x20 - regular space
  \xA0 - non-breaking space
  */

(function() {
	'use strict';

	var verbose = false;

	function logHeader(s) {
		if (verbose) {
			console.log('\x1b[1m' + s + '\x1b[22m');
		}
	}

	function log() {
		if (verbose) {
			var args = _.toArray(arguments).map(function(s) {
				if (typeof s === 'string') {
					return s
						.replace(/\x20/g, '\x1B[36m_\x1B[0m')
						.replace(/\xA0/g, '\x1B[36m❚\x1B[0m')
					;
				}
				if (_.isRegExp(s)) {
					return s.toString();
				}
			});
			console.log.apply(console, args);
		}
	}

	var _ = require('lodash');

	var rules = {},
		currentLang = 'en',
		savedTagsNum,
		savedTags,
		saveTagsRe = [
			/<!(--\[[^\]>]+\]|\[[^\]>]+\]--)>/mig,
			/<!--[\s\S]*?-->/mig,
			/<pre[^>]*>[\s\S]*?<\/pre>/mig,
			/<style[^>]*>[\s\S]*?<\/style>/mig,
			/<script[^>]*>[\s\S]*?<\/script>/mig,
			/<code[^>]*>[\s\S]*?<\/code>/mig,
			/<[a-z\/][^>]*>/mig
		],
		restoreTagsRe = /<(\d+)>/g,
		commonDefs = {
			nbsp: '\xA0',
			hairspace: '&#8202;'
		};


	var shortWordsRegExp = [/(^|[\x20\xA0(>«”„])([а-яёa-zA-ZА-ЯЁ][а-яёa-z]?)\x20/g, '$1$2\xA0'];
	var commonRules = {
		cleanup_before: [
			[/ {2,}/g, ' ']  // Remove repeated spaces
		],

		cleanup_after: [
			[/&nbsp;/g, '\xA0']  // Non-breaking space entinty to symbol
		],

		// Non-breaking space after short words
		short_words: [
			// Run twice to catch pairs of short words: of_a_book
			shortWordsRegExp,
			shortWordsRegExp
		],

		// Hanging punctuation
		_hanging_table: {
			'«': 'laquo',
			'„': 'bdquo',
			'“': 'ldquo',
			'‘': 'lsquo',
			'(': 'brace'
		},
		hanging: [
			[/(^|\s|>)([«„“‘\(])/g, function(s, prefix, symbol) {
				var name = commonRules._hanging_table[symbol],
					html = ([' ', '\xA0', '\n', '\r', '\t'].indexOf(prefix) !== -1)
						? '<span class="s' + name + '"> </span> '
						: prefix;
				return html + '<span class="h' + name + '">' + symbol + '</span>';
			}]
		],

		textify: [
			[/<\/?[^>]+>/g, ''],  // Remove tags
			[/&mdash;/g, '—'],
			[/[\x20\xA0]{2,}/g, ' ']  // Repeated spaces [normal space + nbsp]
		],

		save_tags: function(text) {
			function save(s) {
				savedTags[savedTagsNum] = s;
				return '<' + savedTagsNum++ + '>';
			}

			savedTagsNum = 0;
			savedTags = [];
			for (var reIdx = 0; reIdx < saveTagsRe.length; reIdx++) {
				text = text.replace(saveTagsRe[reIdx], save);
			}
			return text;
		},

		restore_tags: function(text) {
			text = text.replace(restoreTagsRe, function(s, num) {
				return savedTags[num];
			});
			savedTagsNum = 0;
			savedTags = [];
			return text;
		}
	};


	var richtypo = {};

	richtypo.lang = function(lang) {
		if (lang !== undefined) {
			currentLang = lang;
		}
		else {
			return currentLang;
		}
	};

	richtypo.verbose = function(enabled) {
		if (enabled !== undefined) {
			verbose = enabled;
		}
		else {
			return verbose;
		}
	};

	richtypo.lite = function(text, lang) {
		return _process(text, lang, [
			'save_tags',
			'cleanup_before',
			'lite',
			'spaces_lite',
			'quotes',
			'cleanup_after',
			'restore_tags'
		]);
	};

	richtypo.rich = function(text, lang) {
		return _process(text, lang, [
			'save_tags',
			'cleanup_before',
			'short_words',
			'spaces_lite',
			'spaces',
			'abbr',
			'cleanup_after',
			'restore_tags'
		]);
	};

	richtypo.title = function(text, lang) {
		return _process(text, lang, [
			'save_tags',
			'cleanup_before',
			'short_words',
			'spaces_lite',
			'spaces',
			'abbr',
			'amp',
			'hanging',
			'cleanup_after',
			'restore_tags'
		]);
	};

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
			'restore_tags'
		]);
	};

	richtypo.textify = function(text, lang) {
		return _process(text, lang, ['textify']);
	};

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

		logHeader('\n\nLang: ' + lang + ', rules: ' + rulesets.join(', '));
		log('Source:', text);

		var langRules = _getRules(lang);
		if (!langRules) {
			return text;
		}

		for (var setIdx = 0; setIdx < rulesets.length; setIdx++) {
			var rulesetId = rulesets[setIdx];
			var rule = langRules[rulesetId];
			logHeader('\nRule: ' + rulesetId);
			if (_.isFunction(rule)) {
				text = rule(text);
				log(text);
			}
			else if (rule) {
				text = _replace(text, rule);
			}
		}

		return text;
	}


	function _replace(text, rules) {
		for (var ruleIdx = 0; ruleIdx < rules.length; ruleIdx++) {
			var rule = rules[ruleIdx];
			if (Array.isArray(rule[0])) {
				text = _replace(text, rule);
			}
			else {
				log(rule[0], '→', rule[1]);
				text = text.replace(rule[0], rule[1]);
				log(text);
			}
		}
		return text;
	}

	function _compile(json) {
		var defs = _.extend({}, commonDefs, json.defs);
		function compileRule(obj) {
			if (_.isString(obj)) {
				return rulesets[obj];
			}
			else {
				return [new RegExp(_tmpl(obj.regex, defs), obj.flags || 'gi'), _tmpl(obj.result, defs)];
			}
		}

		var rulesets = {};
		for (var name in json.rules) {
			var rule = json.rules[name];
			if (!Array.isArray(rule)) {
				rule = [rule];
			}

			rule = rule.map(compileRule);
			rulesets[name] = rule;
		}

		return rulesets;
	}

	function _tmpl(template, data) {
		return template.replace(/\$\(([^\)]+)\)/g, function tmplReplace(m, key) {
			return data[key] || '';
		});
	}

	function _getRules(lang) {
		if (!rules[lang]) {
			var langRules = {};
			try {
				langRules = require('./rules/' + lang + '.json');
			}
			catch (e) {
				throw new Error('Cannot load rules for language + ' + currentLang + '\n', e);
			}
			langRules = _compile(langRules);
			rules[lang] = _.extend({}, commonRules, langRules);
		}
		return rules[lang];
	}


	module.exports = richtypo;

}());
