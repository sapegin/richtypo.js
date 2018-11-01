import {
	definitions,
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

const { nbsp, space, hairspace, semicolon, notInTag } = definitions;

const ordinals = '(ème|er|ère|nd)s?';
const decimalsSeparator = '[.,]';
const openingQuote = '«';
const closingQuote = '»';
const thousandsSeparator = nbsp;

const quotes = quotesFactory({ openingQuote, closingQuote });
const numberOrdinals = numberOrdinalsFactory({ ordinals });
const numberSeparators = numberSeparatorsFactory({
	thousandsSeparator,
	decimalsSeparator,
});

const punctuation = text =>
	text
		.replace(
			new RegExp(`${notInTag}(?:${space}+)?([\\?!:»]|${semicolon})`, 'gmi'),
			`${hairspace}$1`
		)
		.replace(
			new RegExp(`${notInTag}(«)(?:${space}+)?`, 'gmi'),
			`$1${hairspace}`
		);

const numbers = [numberOrdinals, numberSeparators, numberUnits];

const all = [spaces, quotes, abbr, numbers, emdash, ellipsis, punctuation];

export {
	quotes,
	numbers,
	spaces,
	abbr,
	amp,
	emdash,
	ellipsis,
	punctuation,
	all,
};
export default all;
