#!/usr/bin/env node

'use strict';

const argv = require('optimist')
	.usage('Usage: $0 [--rules full] [--lang en] [--text] filename')
	.boolean('text')
	.default('rules', 'full')
	.default('lang', 'en')
	.demand(1)
	.describe(
		'rules',
		[
			'Ruleset:',
			'    - lite - Simple typographer (quotes, em-dash, etc.) for user generated content (e.g. comments);',
			'    - rich - Enhancing typography: non-breaking spaces, abbreviations;',
			'    - title - Typography for big text: the same as --rich + ampersands and hanging punctuation;',
			'    - full - --light + --rich.',
		].join('\n')
	)
	.describe('lang', 'Text language.')
	.describe('text', 'Strip HTML tags.').argv;

const richtypo = require('../richtypo.js');
const fs = require('fs');

const lang = argv.lang;
const file = argv._[0];

if (!fs.existsSync(file)) {
	// eslint-disable-next-line no-console
	console.log('File "' + file + '" not found.');
	process.exit(1);
}

// Read UTF-8 file and remove BOM
let text = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');

text = richtypo[argv.rules](text, lang);

if (argv.text) {
	text = richtypo.textify(text, lang);
}

// eslint-disable-next-line no-console
console.log(text);
