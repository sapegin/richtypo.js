#!/usr/bin/env node

var argv = require('optimist')
	.usage('Usage: $0 [--rules full] [--lang en] [--text] filename')
	.boolean('text')
	.default('rules', 'full')
	.default('lang', 'en')
	.demand(1)
	.describe('rules', [
		'Ruleset:',
		'    - lite - Simple typographer (quotes, em-dash, etc.) for user generated content (e.g. comments);',
		'    - rich - Enhancing typography: non-breaking spaces, abbreviations;',
		'    - title - Typography for big text: the same as --rich + ampersands and hanging punctuation;',
		'    - full - --light + --rich.'
		].join('\n'))
	.describe('lang', 'Text language.')
	.describe('text', 'Convert result to text.')
	.argv;


var richtypo = require('../richtypo.js');
var fs = require('fs');
var path = require('path');

var lang = argv.lang;
var file = argv._[0];

if (!fs.existsSync(file)) {
	console.log('File "' + file + '" not found.');
	process.exit(1);
}

// Read UTF-8 file and remove BOM
var text = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');

text = richtypo[argv.rules](text, lang);

if (argv.text) {
	text = richtypo.textify(text, lang);
}

console.log(text);
