type Rule = (text: string) => string;

import {
	shortWords,
	orphans,
	definitions,
	abbrs,
	quotesFactory,
	numberOrdinalsFactory,
	numberSeparatorsFactory,
	numberUnits,
	degreeSigns,
	dashesBasic,
	ellipses,
} from 'richtypo-rules-common';

const { punctuation, nbsp, space, nbthinspace, dash, notInTag } = definitions;

const semicolon = '(?<!&\\S*);';
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
		// Replace - at the beginnning of a line or right after a tag with em dash
		.replace(new RegExp(`^-(${space})`, 'gmi'), `—$1`)
		// Add non-braking space between , or ) and a dash
		.replace(
			new RegExp(`(${punctuation})${dash}(${space})`, 'gmi'),
			`$1${nbsp}—$2`
		)
		// Add non-breaking space in front of a dash
		.replace(new RegExp(`${notInTag}(\\S)${space}?—`, 'gmi'), `$1${nbsp}—`);

export const dashes = [dashesBasic, dashesAdvanced];

export const punctuationMarks = (text: string) =>
	text
		.replace(
			new RegExp(`${notInTag}(?:${space}+)?([\\?!:»]|${semicolon})`, 'gmi'),
			`${nbthinspace}$1`
		)
		.replace(
			new RegExp(`${notInTag}(«)(?:${space}+)?`, 'gmi'),
			`$1${nbthinspace}`
		);

export {
	shortWords,
	orphans,
	definitions,
	abbrs,
	numberUnits,
	degreeSigns,
	amps,
	dashesBasic,
	ellipses,
} from 'richtypo-rules-common';

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
