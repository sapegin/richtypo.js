const nbsp = '\xA0';
const hairspace = '\xAF';
const space = `[ \t${nbsp}${hairspace}]`;
const tag = '(?:<[^<>]*>)';
const quote = '["“”«»‘’]';
const letter = '[a-zà-ž0-9а-яё]';
const upperLetter = '[A-ZÀ-ŽdА-ЯЁ]';
const letterOrQuote = `[-“”‘’«»a-zà-ž0-9а-яё]`;
const semicolon = '(?<!&\\S*);';
const punctuation = `(?:${semicolon}|[\\.,!?:])`;
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
	semicolon,
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

// TODO: Hair space in English?
export const dashes = text =>
	text
		// TODO: --- -> —
		.replace(new RegExp(`${notInTag}(\\S)${space}?—`, 'gmi'), `$1${nbsp}—`)
		.replace(new RegExp(`${notInTag}—(\\S)`, 'gmi'), `— $1`)
		.replace(
			new RegExp(
				`${notInTag}(${letterOrQuote}(${tag})?)${space}${dash}`,
				'gmi'
			),
			`$1${nbsp}—`
		)
		.replace(
			new RegExp(
				`(${notInTag}^|(?:(${punctuation}|${openingQuote}|")${space}?))${dash}${space}`,
				'gmi'
			),
			`$1—${nbsp}`
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
