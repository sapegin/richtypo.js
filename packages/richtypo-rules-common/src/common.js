const nbsp = '\xA0';
const hairspace = '\xAF';
const space = `[ \t${nbsp}${hairspace}]`;
const tag = '(?:<[^<>]*>)';
const quotes = '["“”«»‘’]';
const letters = '[a-zà-ž0-9]';
const upperletters = '[A-ZÀ-Ž]';
const letterswithquotes = '[a-zà-ž0-9-“”‘’«»]';
const semicolon = '(?<!&\\S*);';
const punctuation = `(?:${semicolon}|[\\.,!?:])`;
const dash = '[-—]';
const openingQuotes = `[“«]`;
const shortWord = `${letters}{1,2}`;
const notInTag = `(?<!<[^>]*)`;

export const definitions = {
	nbsp,
	hairspace,
	space,
	tag,
	quotes,
	letters,
	upperletters,
	letterswithquotes,
	semicolon,
	punctuation,
	dash,
	openingQuotes,
	shortWord,
	notInTag,
};

// Non-breaking space after short words
export const shortWordBreak = text =>
	text.replace(
		new RegExp(
			`${notInTag}(?<=^|${space}|${quotes}|>)(${shortWord}(${tag})?)${space}`,
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

export const temperature = text =>
	text.replace(
		new RegExp(`${notInTag}(\\d${tag}?)${space}?°`, 'gmi'),
		`$1${nbsp}°`
	);

export const spaces = [numberUnits, temperature, shortWordBreak, orphans];

export const emdash = text =>
	text
		.replace(new RegExp(`${notInTag}(\\S)${space}?—`, 'gmi'), `$1${nbsp}—`)
		.replace(new RegExp(`${notInTag}—(\\S)`, 'gmi'), `— $1`)
		.replace(
			new RegExp(
				`${notInTag}(${letterswithquotes}(${tag})?)${space}${dash}`,
				'gmi'
			),
			`$1${nbsp}—`
		)
		.replace(
			new RegExp(
				`(${notInTag}^|(?:(${punctuation}|${openingQuotes}|")${space}?))${dash}${space}`,
				'gmi'
			),
			`$1—${nbsp}`
		);

export const ellipsis = text =>
	text.replace(new RegExp(`${notInTag}\\.{2,}`, 'gmi'), `…`);

export const amp = text =>
	text.replace(
		new RegExp(`${notInTag}${space}(&(?!\\S*;))${space}`, 'gmi'),
		`${nbsp}<span class="amp">&</span>${nbsp}`
	);

export const abbr = text =>
	text.replace(
		new RegExp(`${notInTag}(\\b${upperletters}{3,5}\\b)`, 'gm'),
		`<abbr>$1</abbr>`
	);

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
			new RegExp(`${notInTag}"((${tag})?(${dash}${space})?${letters})`, 'gmi'),
			`${openingQuote}$1`
		)
		.replace(new RegExp(`${notInTag}"`, 'gmi'), `${closingQuote}`);
