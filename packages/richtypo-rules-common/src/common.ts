const nbsp = '\xA0';
const hairspace = '\xAF';
const space = `[ \t${nbsp}${hairspace}]`;
const tag = '(?:<[^<>]*>)';
const quote = '["“”«»‘’]';
const letter = '[a-zà-ž0-9а-яё]';
const letterOrHyphen = '[-a-zà-ž0-9а-яё]';
const notLetterOrHyphen = '[^-a-zà-ž0-9а-яё]';
const upperLetter = '[A-ZÀ-ŽА-ЯЁ]';
const letterOrQuote = `[-“”‘’«»a-zà-ž0-9а-яё]`;
const punctuation = `[.,!?:;)(]`;
const punctuationOrQuote = `[.,!?:;)("“”«»‘’]`;
const endash = '–';
const emdash = '—';
const dash = `[-${endash}${emdash}]`;
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
	punctuationOrQuote,
	endash,
	emdash,
	dash,
	openingQuote,
	shortWord,
	notInTag,
};

// Non-breaking space after short words
export const shortWords = (text: string) =>
	text.replace(
		new RegExp(
			`${notInTag}(?<=^|${space}|${punctuationOrQuote}|>)(${shortWord}(${tag})?)${space}`,
			'gmi'
		),
		`$1${nbsp}`
	);

// Orphans (non-breaking space before the last word)
export const orphans = (text: string) =>
	text.replace(
		new RegExp(`${notInTag}(?<![\\#-])${space}([\\S<]{1,10}(?:\n\n|$))`, 'gmi'),
		`${nbsp}$1`
	);

export const numberUnits = (text: string) =>
	text.replace(
		new RegExp(`${notInTag}(\\d+${tag}?)${space}(\\w)`, 'gmi'),
		`$1${nbsp}$2`
	);

export const degreeSigns = (text: string) =>
	text.replace(
		new RegExp(`${notInTag}(\\d${tag}?)${space}?[˚°]`, 'gmi'),
		`$1${hairspace}°`
	);

export const ellipses = (text: string) =>
	text.replace(new RegExp(`${notInTag}\\.{2,}`, 'gmi'), `…`);

export const amps = (text: string) =>
	text.replace(
		new RegExp(`${notInTag}${space}(&(?!\\S*;))${space}`, 'gmi'),
		`${nbsp}<span class="amp">&</span>${nbsp}`
	);

export const abbrs = (text: string) =>
	text.replace(
		new RegExp(`${notInTag}(${upperLetter}{3,})`, 'gm'),
		`<abbr>$1</abbr>`
	);

// Nowrap short words with a hyphen ("из-за")
export const hyphenatedWords = (text: string) =>
	text.replace(
		new RegExp(
			`(${notLetterOrHyphen}|^)((?:${letter}{1,2}(?:-${letter}+))|(?:${letter}+(?:-${letter}{1,2})))(?!${letterOrHyphen})`,
			'gi'
		),
		`$1<nobr>$2</nobr>`
	);

export const dashesBasic = (text: string) =>
	text
		// Replace -- or --- with em dash
		.replace(new RegExp(`${notInTag}(?<!\n)---?(?!\n)`, 'gmi'), emdash)
		// Replace - with em dash if there's a space or a tag before and a space after it
		.replace(
			new RegExp(`(${space}|${tag})[-${endash}](${space})`, 'gmi'),
			`$1${emdash}$2`
		);

export const numberOrdinalsFactory =
	(props: { ordinal: string }) => (text: string) =>
		text.replace(
			new RegExp(`${notInTag}(\\d+)(${props.ordinal})`, 'gmi'),
			`$1<sup>$2</sup>`
		);

export const numberSeparatorsFactory =
	(props: { decimalsSeparator: string; thousandsSeparator: string }) =>
	(text: string) =>
		text.replace(
			new RegExp(
				`(?<!${props.decimalsSeparator}\\d*)\\d{1,3}(?=(\\d{3})+(?!\\d))`,
				'gmi'
			),
			`$&${props.thousandsSeparator}`
		);

export const quotesFactory =
	(props: { openingQuote: string; closingQuote: string }) => (text: string) =>
		text
			.replace(
				new RegExp(`${notInTag}"((${tag})?(${dash}${space})?${letter})`, 'gmi'),
				`${props.openingQuote}$1`
			)
			.replace(new RegExp(`${notInTag}"`, 'gmi'), `${props.closingQuote}`);
