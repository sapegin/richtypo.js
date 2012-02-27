(function(global) {

// @todo abbr
// @todo amp

var rules = {},
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
	_cleanup: [
		[/&nbsp;/g, nbsp],
	],

	save_tags: function(text) {
		savedTagsNum = 0;
		savedTags = [];
		for (var reIdx = 0; reIdx < saveTagsRe.length; reIdx++) {
			text = text.replace(saveTagsRe[reIdx], function(s) {
				savedTags[savedTagsNum] = s
				return '<' + savedTagsNum++ + '>';
			});
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


var richtypo = {},
	_lang = 'ru';

richtypo.lang = function(lang) {
	if (lang !== undefined) {
		_lang = lang;
	}
	else {
		// Load rules
		if (!rules[_lang]) {
			var langRules = {}
			try {
				langRules = require('./rules/' + _lang + '.js');
			}
			catch(e) {
				console.log('xxxx', e);
			}
			rules[_lang] = _extend(commonRules, langRules);
		}

		return _lang;
	}
};


richtypo.lite = function(text, lang) {
	return _process(text, lang, ['save_tags', 'lite', 'spaces_lite', 'quotes', 'cleanup', 'restore_tags']);
};

richtypo.rich = function(text, lang) {
	return _process(text, lang, ['save_tags', 'spaces_lite', 'spaces', 'cleanup', 'restore_tags']);
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
		// console.log('RE', rule[0])
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


// Support both Node and browser environments
//if (typeof module !== 'undefined' && module.exports) {
	module.exports = richtypo;
//}
//else {
//	global.richtypo = richtypo;
//}

})(this);