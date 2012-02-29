/**
 * Richtypo
 * Typography enhancer for Node.js
 *
 * Rules for English language
 *
 * @author Artem Sapegin
 * @copyright 2012 Artem Sapegin (sapegin.me)
 * @license MIT
 */


// Non-breaking space
var _nbsp = String.fromCharCode(160);

// Prepositions and conjunctions
var _prepos = 'at|or|and|the|a|by|an|in|on|of|for|to|as|i|or|my';


module.exports = {
	_spaces_lite: [
		// En/Em Dashes
		[/\s([—–])/g, _nbsp + '$1'],
		[/(\w+[—–])(\w)/g, '<nobr>$1</nobr>$2'],
	],
	_spaces: [
		// Words with hyphens
		[/(\W|^)((?:\w{1,2}(?:\-\w+))|(?:\w+(?:\-\w{1,2})))(?!\w)/g, '$1<nobr>$2</nobr>'],  // @todo \b ?

		// Prepositions and conjunctions
		[new RegExp('(\\W|^)(' + _prepos + ')\\s', 'gi'), '$1$2' + _nbsp]  // @todo \b ?
	],
	_lite: [
		// Ellipsis
		[/\.{2,}/g, '…'],

		// Em Dash
		[/---?/g, '—'],
		[/ - /g, ' — '],
		[/([,\)>])- /g, '$1 — '],
		[/(^|\n)\-/g, '$1&mdash;']  // For strange reason '\n—' replace '\n' with space
	],
	_quotes: [
		[/"(\w)/gi, '“$1'],
		[/"/gi, '”']
	],
	_amps: [
		[/&amp;/g, '<span class="amp">&amp;</span>']
	],
	_abbrs: [
		[/([A-Z]{3,})/g, '<abbr>$1</abbr>']
	]
};