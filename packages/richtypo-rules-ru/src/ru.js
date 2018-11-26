import {
	numberUnits,
	degreeSigns,
	shortWords,
	orphans,
	abbrs,
	ellipses,
	dashesBasic,
	quotesFactory,
	numberSeparatorsFactory,
	definitions,
} from 'richtypo-rules-common';

const {
	notInTag,
	space,
	nbsp,
	hairspace,
	endash,
	emdash,
	dash,
	punctuation,
} = definitions;
const thousandsSeparator = hairspace;
const decimalsSeparator = ',';
const openingQuote = '«';
const closingQuote = '»';
const particle = 'б|бы|ж|же|ли|ль';

export const dashesAdvanced = text =>
	text
		// Replace - at the beginnning of a line or right after a tag with em dash
		.replace(new RegExp(`^-(${space})`, 'gmi'), `${emdash}$1`)
		// Add non-braking space between , or ) and a dash
		.replace(
			new RegExp(`(${punctuation})${dash}(${space})`, 'gmi'),
			`$1${nbsp}${emdash}$2`
		)
		// Add non-breaking space in front of a dash
		.replace(
			new RegExp(`${notInTag}(\\S)${space}?[${endash}${emdash}]`, 'gmi'),
			`$1${nbsp}${emdash}`
		);

export const dashes = [dashesBasic, dashesAdvanced];

// Spaces inside "и т. д." and "и т. п."
export const etcs = text =>
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
			new RegExp(`([а-яёА-ЯЁ]) (${particle})(?=[?!,.:;"‘“»])`, 'g'),
			`$1${nbsp}$2`
		)
		.replace(
			new RegExp(`([а-яёА-ЯЁ])${space}(${particle})${space}`, 'g'),
			`$1${nbsp}$2 `
		);

export const quotes = quotesFactory({ openingQuote, closingQuote });

export const numberSeparators = numberSeparatorsFactory({
	thousandsSeparator,
	decimalsSeparator,
});

export {
	numberUnits,
	degreeSigns,
	shortWords,
	orphans,
	abbrs,
	ellipses,
	dashesBasic,
} from 'richtypo-rules-common';

// TODO: export defs

// Not in recommended:
// - numberSeparators - breaks years, like "1920"

const recommended = [
	// Common rules
	numberUnits,
	shortWords,
	orphans,
	abbrs,
	ellipses,
	quotes,
	degreeSigns,
	// Custom rules
	etcs,
	numberSigns,
	sectionSigns,
	initials,
	hyphenatedWords,
	particles,
	dashes,
];
export default recommended;
