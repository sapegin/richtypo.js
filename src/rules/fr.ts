type Rule = (text: string) => string;

import {
	abbrs,
	dashesBasic,
	definitions,
	degreeSigns,
	ellipses,
	numberOrdinalsFactory,
	numberSeparatorsFactory,
	numberUnits,
	orphans,
	quotesFactory,
	shortWords,
} from './common.js';

const { punctuation, nbsp, space, nbthinspace, dash, notInTag } = definitions;

const semicolon = String.raw`(?<!&\S*);`;
const ordinal = '(ème|er|ère|nd)s?';
const decimalsSeparator = '[.,]';
const openingQuote = '«';
const closingQuote = '»';
const thousandsSeparator = nbsp;

export const quotes = quotesFactory({ openingQuote, closingQuote });
export const numberOrdinals = numberOrdinalsFactory({ ordinal });
export const numberSeparators = numberSeparatorsFactory({
	thousandsSeparator,
	decimalsSeparator,
});

export const dashesAdvanced = (text: string) =>
	text
		// Replace - at the beginning of a line or right after a tag with em dash
		.replaceAll(new RegExp(`^-(${space})`, 'gmi'), `—$1`)
		// Add non-braking space between , or ) and a dash
		.replaceAll(
			new RegExp(`(${punctuation})${dash}(${space})`, 'gmi'),
			`$1${nbsp}—$2`,
		)
		// Add non-breaking space in front of a dash
		.replaceAll(
			new RegExp(String.raw`${notInTag}(\S)${space}?—`, 'gmi'),
			`$1${nbsp}—`,
		);

export const dashes = [dashesBasic, dashesAdvanced];

export const punctuationMarks = (text: string) =>
	text
		.replaceAll(
			new RegExp(
				String.raw`${notInTag}(?:${space}+)?([\?!:»]|${semicolon})`,
				'gmi',
			),
			`${nbthinspace}$1`,
		)
		.replaceAll(
			new RegExp(`${notInTag}(«)(?:${space}+)?`, 'gmi'),
			`$1${nbthinspace}`,
		);

export {
	abbrs,
	amps,
	dashesBasic,
	definitions,
	degreeSigns,
	ellipses,
	numberUnits,
	orphans,
	shortWords,
} from './common.js';

// Not in recommended:
// - amps
// - numberOrdinals
// - numberSeparators - breaks years, like "1920"

const recommended: Rule[] = [
	// Common rules
	shortWords,
	orphans,
	abbrs,
	...dashes,
	ellipses,
	numberUnits,
	degreeSigns,
	// Custom rules
	quotes,
	punctuationMarks,
];

export default recommended;
