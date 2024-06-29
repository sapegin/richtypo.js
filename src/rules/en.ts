type Rule = (text: string) => string;

import {
	shortWords,
	orphans,
	ellipses,
	dashesBasic,
	numberUnits,
	degreeSigns,
	quotesFactory,
	numberOrdinalsFactory,
	numberSeparatorsFactory,
	definitions as commonDefinitions,
} from './common.js';

const {
	punctuation,
	punctuationOrQuote,
	emdash,
	dash,
	space,
	nbsp,
	thinspace,
	nbthinspace,
	tag,
	notInTag,
} = commonDefinitions;
const thousandsSeparator = ',';
const decimalsSeparator = '[.]';
const ordinal = '(st|nd|rd|th)';
const preposition = 'and|the|for';
const openingQuote = '“';
const closingQuote = '”';

export const definitions = {
	...commonDefinitions,
	thousandsSeparator,
	decimalsSeparator,
	ordinal,
	preposition,
	openingQuote,
	closingQuote,
};

// Prepositions
export const prepositions = (text: string) =>
	text.replace(
		new RegExp(
			`${notInTag}(?<=^|${space}|${punctuationOrQuote}|>)(${preposition}(${tag})?)${space}`,
			'gmi',
		),
		`$1${nbsp}`,
	);

export const dashesAdvanced = (text: string) =>
	text
		// Add non-breaking thin space between , or ) and a dash
		.replace(
			new RegExp(`(${punctuation})${dash}(${space}?)`, 'gmi'),
			`$1${nbthinspace}${emdash}$2`,
		)
		// Add non-breaking thin space between a tag and a dash
		.replace(
			new RegExp(`(?<!\\s)(${tag})${dash}(${space}?)`, 'gmi'),
			`$1${nbthinspace}${emdash}$2`,
		)
		// Add a work joiner character between emdash and preceding word to avoid line wrapping
		.replace(
			new RegExp(
				`(?<!\\n[^ ]+)([^\\s\\]\\)\\>]+)${space}?${emdash}${space}?`,
				'gmi',
			),
			`$1${nbthinspace}${emdash}${thinspace}`,
		)
		// Add non-breaking thin spaces before, and normal thin space after an em dash
		.replace(
			new RegExp(`${space}${emdash}${space}`, 'gmi'),
			`${nbthinspace}${emdash}${thinspace}`,
		);

/** @deprecated Use `dashesBasic` or `dashesAdvanced` directly */
export const dashes = [dashesBasic, dashesAdvanced];

export const quotes = quotesFactory({ openingQuote, closingQuote });
export const numberOrdinals = numberOrdinalsFactory({ ordinal });
export const numberSeparators = numberSeparatorsFactory({
	thousandsSeparator,
	decimalsSeparator,
});

export {
	shortWords,
	hyphenatedWords,
	orphans,
	abbrs,
	amps,
	ellipses,
	dashesBasic,
	numberUnits,
	degreeSigns,
} from './common.js';

// TODO: export defs

// Not in recommended:
// - amps, abbrs - add HTML and require custom styling
// - numberOrdinals
// - numberSeparators - breaks years, like "1920"
// - dashesLite - used for the plain preset
// - hyphenatedWords - does't really make sense with `hyphens: auto` anymore

/** Recommended rules */
const recommended: Rule[] = [
	// Common rules
	shortWords,
	prepositions,
	orphans,
	dashesBasic,
	dashesAdvanced,
	ellipses,
	numberUnits,
	degreeSigns,
	// Custom rules
	quotes,
];

export default recommended;
