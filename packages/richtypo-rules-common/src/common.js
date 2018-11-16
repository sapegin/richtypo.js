const nbsp = '\xA0';
const hairspace = '\xAF';
const space = `[ \t${nbsp}${hairspace}]`;
const tag = '(?:<[^<>]*>)';
const quote = '["“”«»‘’]';
const letter = '[a-zà-ž0-9а-яё]';
const letterOrHyphen = '[-a-zà-ž0-9а-яё]';
const notLetterOrHyphen = '[^-a-zà-ž0-9а-яё]';
const upperLetter = '[A-ZÀ-ŽdА-ЯЁ]';
const letterOrQuote = `[-“”‘’«»a-zà-ž0-9а-яё]`;
const punctuation = `[.,!?:;)]`;
const dash = '[-—]';
const openingQuote = `[“‘«]`;
const shortWord = `${letter}{1,2}`;
const notInTag = `(?<!<[^>]*)`;

export const definitions = {
	nbsp,
	hairspace,
	space,
	tag,
	quote,
	letter,
	upperLetter,
	letterOrQuote,
	punctuation,
	dash,
	openingQuote,
	shortWord,
	notInTag,
};

// Non-breaking space after short words
export const shortWords = text =>
	text.replace(
		new RegExp(
			`${notInTag}(?<=^|${space}|${quote}|>)(${shortWord}(${tag})?)${space}`,
			'gmi'
		),
		`$1${nbsp}`
	);

// Orphans (non-breaking space before the last word)
export const orphans = text =>
	text.replace(
		new RegExp(`${notInTag}${space}([\\S<]{1,10}(?:\n\n|$))`, 'gmi'),
		`${nbsp}$1`
	);

export const numberUnits = text =>
	text.replace(
		new RegExp(`${notInTag}(\\d+${tag}?)${space}(\\w)`, 'gmi'),
		`$1${nbsp}$2`
	);

export const degreeSigns = text =>
	text.replace(
		new RegExp(`${notInTag}(\\d${tag}?)${space}?°`, 'gmi'),
		`$1${hairspace}°`
	);

export const ellipses = text =>
	text.replace(new RegExp(`${notInTag}\\.{2,}`, 'gmi'), `…`);

export const amps = text =>
	text.replace(
		new RegExp(`${notInTag}${space}(&(?!\\S*;))${space}`, 'gmi'),
		`${nbsp}<span class="amp">&</span>${nbsp}`
	);

export const abbrs = text =>
	text.replace(
		new RegExp(`${notInTag}(${upperLetter}{3,})`, 'gm'),
		`<abbr>$1</abbr>`
	);

// Nowrap short words with a hyphen ("из-за")
export const hyphenatedWords = text =>
	text.replace(
		new RegExp(
			`(${notLetterOrHyphen}|^)((?:${letter}{1,2}(?:-${letter}+))|(?:${letter}+(?:-${letter}{1,2})))(?!${letterOrHyphen})`,
			'gi'
		),
		`$1<nobr>$2</nobr>`
	);

export const dashesBasic = text =>
	text
		// Replace -- or --- with em dash
		.replace(new RegExp(`${notInTag}---?`, 'gmi'), `—`)
		// Replace - with em dash if there's a space or a tag before and a space after it
		.replace(new RegExp(`(${space}|${tag})-(${space})`, 'gmi'), `$1—$2`);

export const numberOrdinalsFactory = ({ ordinals }) => text =>
	text.replace(
		new RegExp(`${notInTag}(\\d+)(${ordinals})`, 'gmi'),
		`$1<sup>$2</sup>`
	);

export const numberSeparatorsFactory = ({
	decimalsSeparator,
	thousandsSeparator,
}) => text =>
	text.replace(
		new RegExp(
			`(?<!${decimalsSeparator}\\d*)\\d{1,3}(?=(\\d{3})+(?!\\d))`,
			'gmi'
		),
		`$&${thousandsSeparator}`
	);

export const quotesFactory = ({ openingQuote, closingQuote }) => text =>
	text
		.replace(
			new RegExp(`${notInTag}"((${tag})?(${dash}${space})?${letter})`, 'gmi'),
			`${openingQuote}$1`
		)
		.replace(new RegExp(`${notInTag}"`, 'gmi'), `${closingQuote}`);
