(function(global) {

var rules = {},
	currentLang = 'en',
	nbsp = String.fromCharCode(160),
	savedTagsNum,
	savedTags,
	saveTagsRe = [
		/<pre[^>]*>[\s\S]*?<\/pre>/mig,
		/<style[^>]*>[\s\S]*?<\/style>/mig,
		/<script[^>]*>[\s\S]*?<\/script>/mig,
		/<code[^>]*>[\s\S]*?<\/code>/mig,
		/<!--[\s\S]*?-->/mig,
		/<[a-z\/][^>]*>/mig
	],
	restoreTagsRe = /<(\d+)>/g;


var commonRules = {
	_cleanup_before: [
		[/ {2,}/g, ' '],  // Remove repeated spaces
	],

	_cleanup_after: [
		[/&nbsp;/g, nbsp],  // Non-breaking space entinty to symbol
	],

	// Hanging punctuation
	_hangingTable: {
		'«': 'laquo',
		'„': 'laquo',
		'“': 'laquo',
		'‘': 'laquo',
		'(': 'brace',
	},
	_hanging: [
		[/[«„“‘\(]/g, function(s) {
			var name = commonRules._hangingTable[s];
			return '<span class="s' + name + '"> </span> <span class="h' + name + '">' + s + '</span>'
		}],
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
		// Load rules
		if (!rules[currentLang]) {
			var langRules = {};
			try {
				langRules = require('./rules/' + currentLang + '.js');
			}
			catch(e) {
				// console.log('Cannot load rules for language + ' + currentLang + '\n', e);
			}
			rules[currentLang] = _extend(commonRules, langRules);
		}

		return currentLang;
	}
};


richtypo.lite = function(text, lang) {
	return _process(text, lang, ['save_tags', 'cleanup_before', 'lite', 'spaces_lite', 'quotes', 'cleanup_after', 'restore_tags']);
};

richtypo.rich = function(text, lang) {
	return _process(text, lang, ['save_tags', 'cleanup_before', 'spaces_lite', 'spaces', 'abbrs', 'cleanup_after', 'restore_tags']);
};

richtypo.title = function(text, lang) {
	return _process(text, lang, ['save_tags', 'cleanup_before', 'spaces_lite', 'spaces', 'abbrs', 'amps', 'hanging', 'cleanup_after', 'restore_tags']);
};

richtypo.richtypo = function(text, rulesets, lang) {
	return _process(text, lang, rulesets);
};


function _process(text, lang, ruleset) {
	var rulesets = typeof ruleset === 'string' ? [ruleset] : ruleset;
	lang = lang || richtypo.lang();
	if (!rules[lang]) return text;
	var langRules = rules[lang];

	for (var setIdx = 0; setIdx < rulesets.length; setIdx++) {
		var rulesetId = rulesets[setIdx];
		if (langRules[rulesetId]) {
			text = langRules[rulesetId](text);
		}
		else if (langRules['_' + rulesetId]) {
			text = _replace(text, langRules['_' + rulesetId]);
		}
	}

	return text;
}


function _replace(text, rules) {
	for (var ruleIdx = 0; ruleIdx < rules.length; ruleIdx++) {
		var rule = rules[ruleIdx];
		text = text.replace(rule[0], rule[1]);
	}
	return text;
}


function _extend(from, to) {
	for (var key in from) {
		if (!from.hasOwnProperty(key)) continue;
		to[key] = from[key];
	}
	return to;
}


module.exports = richtypo;

})(this);