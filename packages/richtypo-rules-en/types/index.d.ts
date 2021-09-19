declare module 'richtypo-rules-en' {
	type Rule = (text: string) => string;

	export const definitions: {
		nbsp: string;
		hairspace: string;
		space: string;
		tag: string;
		quote: string;
		letter: string;
		letterOrHyphen: string;
		notLetterOrHyphen: string;
		upperLetter: string;
		letterOrQuote: string;
		punctuation: string;
		punctuationOrQuote: string;
		endash: string;
		emdash: string;
		dash: string;
		openingQuote: string;
		shortWord: string;
		notInTag: string;
		thousandsSeparator: string;
		decimalsSeparator: string;
		ordinal: string;
		preposition: string;
		openingQuote: string;
		closingQuote: string;
	};

	export function abbrs(text: string): string;
	export function amps(text: string): string;
	export function dashesAdvanced(text: string): string;
	export function dashesBasic(text: string): string;
	export function degreeSigns(text: string): string;
	export function ellipses(text: string): string;
	export function hyphenatedWords(text: string): string;
	export function numberOrdinals(text: string): string;
	export function numberSeparators(text: string): string;
	export function numberUnits(text: string): string;
	export function orphans(text: string): string;
	export function prepositions(text: string): string;
	export function quotes(text: string): string;
	export function shortWords(text: string): string;

	export const dashes: Rule[];

	const recommended: Rule[];
	export default recommended;
}
