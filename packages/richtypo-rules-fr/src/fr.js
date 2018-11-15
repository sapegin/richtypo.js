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
	amps,
	dashes,
	ellipses,
} from 'richtypo-rules-common';

const { nbsp, space, hairspace, semicolon, notInTag } = definitions;

const ordinals = '(ème|er|ère|nd)s?';
const decimalsSeparator = '[.,]';
const openingQuote = '«';
const closingQuote = '»';
const thousandsSeparator = nbsp;

export const quotes = quotesFactory({ openingQuote, closingQuote });
export const numberOrdinals = numberOrdinalsFactory({ ordinals });
export const numberSeparators = numberSeparatorsFactory({
	thousandsSeparator,
	decimalsSeparator,
});

export const punctuation = text =>
	text
		.replace(
			new RegExp(`${notInTag}(?:${space}+)?([\\?!:»]|${semicolon})`, 'gmi'),
			`${hairspace}$1`
		)
		.replace(
			new RegExp(`${notInTag}(«)(?:${space}+)?`, 'gmi'),
			`$1${hairspace}`
		);

export {
	shortWords,
	orphans,
	definitions,
	abbrs,
	numberUnits,
	degreeSigns,
	amps,
	dashes,
	ellipses,
} from 'richtypo-rules-common';

// Not in recommended:
// - numberOrdinals
// - numberSeparators - breaks years, like "1920"

const recommended = [
	// Common rules
	shortWords,
	orphans,
	abbrs,
	amps,
	dashes,
	ellipses,
	numberUnits,
	degreeSigns,
	// Custom rules
	quotes,
	punctuation,
];

export default recommended;
