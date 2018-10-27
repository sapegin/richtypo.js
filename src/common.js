export const defs = {
	nbsp: '\xA0',
	hairspace: '\xAF',
	space: ({ nbsp, hairspace }) => `[ \t${nbsp}${hairspace}]`,
	tag: '<[^<>]*>',
	quotes: '["“”«»‘’]',
	letters: '[a-zà-ž0-9]',
	upperletters: '[A-ZÀ-Ž]',
	nonletters: '[^a-zà-ž0-9]',
	letterswithquotes: '[a-zà-ž0-9-“”‘’«»]',
	semicolon: '(?<!&\\S*);',
	punctuation: ({ semicolon }) => `(?:${semicolon}|[\\.,!?:])`,
	dash: '[-—]',
	thousandsSeparator: ',',
	decimalsSeparator: '[.]',
	ordinals: '(?:st|nd|rd|th)',
	openingQuote: '“',
	closingQuote: '”',
	shortWord: ({ letters }) => `${letters}{1,2}`,
};

// Non-breaking space after short words
export const shortWordBreak = ({ shortWord, quotes, space, nbsp, tag }) => ({
	regex: `(?<=^|${space}|${quotes}|>)(${shortWord}(${tag})?)${space}`,
	replace: `$1${nbsp}`,
});

// Orphans (non-breaking space before the last word)
export const orphans = ({ space, nbsp }) => ({
	regex: `${space}([\\S<]{1,10}(?:\n\n|$))`,
	replace: `${nbsp}$1`,
});

export const numberUnits = ({ space, nbsp }) => ({
	regex: `(\\d+)${space}(\\w)`,
	replace: `$1${nbsp}$2`,
});

export const temperature = ({ space, nbsp }) => ({
	regex: `(\\d)${space}?°`,
	replace: `$1${nbsp}°`,
});

export const spaces = { numberUnits, temperature, shortWordBreak, orphans };

export const emdash = [
	({ space, nbsp }) => ({
		regex: `(\\S)${space}?—`,
		replace: `$1${nbsp}—`,
	}),
	{
		regex: `—(\\S)`,
		replace: `— $1`,
	},
	({ space, nbsp, letterswithquotes, tag, dash }) => ({
		regex: `(${letterswithquotes}(${tag})?)${space}${dash}`,
		replace: `$1${nbsp}—`,
	}),
	({ space, nbsp, punctuation, openingQuote, dash }) => ({
		regex: `(^|(?:(${punctuation}|${openingQuote}|")${space}?))${dash}${space}`,
		replace: `$1—${nbsp}`,
	}),
];

export const ellipsis = {
	regex: `\\.{2,}`,
	replace: `…`,
};

export const amp = ({ space, nbsp }) => ({
	regex: `${space}(&(?!\\S*;))${space}`,
	replace: `${nbsp}<span class="amp">&</span>${nbsp}`,
});

export const abbr = ({ upperletters }) => ({
	regex: `(${upperletters}{3,})`,
	flags: `gm`,
	replace: `<abbr>$1</abbr>`,
});

export const numbers = [
	({ ordinals }) => ({
		regex: `(\\d+)(${ordinals})`,
		replace: `$1<sup>$2</sup>`,
	}),
	({ decimalsSeparator, thousandsSeparator }) => ({
		regex: `(?<!${decimalsSeparator}\\d*)\\d{1,3}(?=(\\d{3})+(?!\\d))`,
		replace: `$&${thousandsSeparator}`,
	}),
];

export const quotes = [
	({ tag, letters, dash, space, openingQuote }) => ({
		regex: `"((${tag})?(${dash}${space})?${letters})`,
		replace: `${openingQuote}$1`,
	}),
	({ closingQuote }) => ({
		regex: `"`,
		replace: `${closingQuote}`,
	}),
];
