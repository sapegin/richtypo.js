import {
	numberUnits,
	temperature,
	shortWordBreak,
	orphans,
	abbr,
	ellipsis,
	quotesFactory,
	numberSeparatorsFactory,
	definitions,
} from 'richtypo-rules-common';

const { notInTag, space, nbsp, hairspace, dash, punctuation } = definitions;
const thousandsSeparator = hairspace;
const decimalsSeparator = ',';
const openingQuote = '«';
const closingQuote = '»';
const particleWords = 'б|бы|ж|же|ли|ль';

export const emdash = text =>
	text
		// Replace -- or --- with em dash
		.replace(new RegExp(`${notInTag}---?`, 'gmi'), `—`)
		// Replace - at the beginnning of a line or right after a tag with em dash
		.replace(new RegExp(`^-`, 'gmi'), `—`)
		.replace(new RegExp(`${notInTag}-(${space})`, 'gmi'), `—$1`)
		// Add non-braking space between , or ) and a dash
		.replace(
			new RegExp(`${notInTag}(${punctuation}])${dash}(${space})`, 'gmi'),
			`$1${nbsp}—$2`
		)
		// Add non-breaking space in front of a dash
		.replace(new RegExp(`${notInTag}(\\S)${space}?—`, 'gmi'), `$1${nbsp}—`);

// Spaces inside "и т. д." and "и т. п."
export const etc = text =>
	text
		.replace(
			new RegExp(`и${space}т\\.${space}д\\.`, 'gi'),
			`и${nbsp}т.${nbsp}д.`
		)
		.replace(
			new RegExp(`и${space}т\\.${space}п\\.`, 'gi'),
			`и${nbsp}т.${nbsp}п.`
		);

// Spaces inside "№ N"
export const numberSigns = text =>
	text.replace(new RegExp(`№${space}`, 'g'), `№${nbsp}`);

// Spaces inside "§ N"
export const sectionSigns = text =>
	text.replace(new RegExp(`§${space}`, 'g'), `§${nbsp}`);

// Nowrap ("В. И. Ленин")
export const initials = text =>
	text.replace(/((?:[А-ЯЁ]\.\s){1,2}[А-ЯЁ][а-яё]+)/g, `<nobr>$1</nobr>`);

// Nowrap short words with a hyphen ("из-за")
export const hyphenatedWords = text =>
	text.replace(
		/([^а-яёА-ЯЁ]|^)((?:[а-яёА-ЯЁ]{1,2}(?:-[а-яёА-ЯЁ]+))|(?:[а-яёА-ЯЁ]+(?:-[а-яёА-ЯЁ]{1,2})))(?![-а-яёА-ЯЁ])/g,
		`$1<nobr>$2</nobr>`
	);

// Particles
export const particles = text =>
	text
		.replace(
			new RegExp(`([а-яёА-ЯЁ]) (${particleWords})(?=[?!,.:;"‘“»])`, 'g'),
			`$1${nbsp}$2`
		)
		.replace(
			new RegExp(`([а-яёА-ЯЁ])${space}(${particleWords})${space}`, 'g'),
			`$1${nbsp}$2 `
		);

export const quotes = quotesFactory({ openingQuote, closingQuote });

export const numberSeparators = numberSeparatorsFactory({
	thousandsSeparator,
	decimalsSeparator,
});

export {
	numberUnits,
	temperature,
	shortWordBreak,
	orphans,
	abbr,
	ellipsis,
	quotesFactory,
	numberSeparatorsFactory,
	definitions,
} from 'richtypo-rules-common';

// TODO: export defs

// Not in recommended:
// - numberSeparators - breaks years, like "1920"

const recommended = [
	// Common rules
	numberUnits,
	temperature,
	shortWordBreak,
	orphans,
	abbr,
	ellipsis,
	quotes,
	// Custom rules
	etc,
	numberSigns,
	sectionSigns,
	initials,
	hyphenatedWords,
	particles,
	emdash,
];
export default recommended;
