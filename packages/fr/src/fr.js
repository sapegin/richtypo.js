import {
	definitions,
	spaces,
	abbr,
	quotesFactory,
	numberOrdinalsFactory,
	numberSeparatorsFactory,
	amp,
	emdash,
	ellipsis,
} from 'richtypo-rules-common';

const { nbsp, space, hairspace, semicolon, notInTag } = definitions;

const ordinals = '(?:ème|er|ère|nd)s?';
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

const numbers = [numberOrdinals, numberSeparators];

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

export default {
	spaces,
	quotes,
	abbr,
	punctuation,
	numbers,
	emdash,
	amp,
	ellipsis,
	all: [spaces, quotes, abbr, ellipsis, punctuation, numbers, emdash],
};
