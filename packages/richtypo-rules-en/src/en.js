import {
	spaces,
	abbr,
	quotesFactory,
	numberOrdinalsFactory,
	numberSeparatorsFactory,
	numberUnits,
	amp,
	emdash,
	ellipsis,
} from 'richtypo-rules-common';

const thousandsSeparator = ',';
const decimalsSeparator = '[.]';
const ordinals = '(st|nd|rd|th)';
const openingQuote = '“';
const closingQuote = '”';

const quotes = quotesFactory({ openingQuote, closingQuote });
const numberOrdinals = numberOrdinalsFactory({ ordinals });
const numberSeparators = numberSeparatorsFactory({
	thousandsSeparator,
	decimalsSeparator,
});

const numbers = [numberOrdinals, numberSeparators, numberUnits];

export default {
	spaces,
	quotes,
	abbr,
	numbers,
	emdash,
	amp,
	ellipsis,
	all: [spaces, quotes, abbr, numbers, emdash, ellipsis],
};
