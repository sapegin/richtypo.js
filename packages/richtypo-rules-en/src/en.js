import {
	spaces,
	abbr,
	amp,
	emdash,
	ellipsis,
	numberUnits,
	quotesFactory,
	numberOrdinalsFactory,
	numberSeparatorsFactory,
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
const all = [spaces, quotes, abbr, numbers, emdash, ellipsis];

export { quotes, numbers, spaces, abbr, amp, emdash, ellipsis, all };
export default all;
