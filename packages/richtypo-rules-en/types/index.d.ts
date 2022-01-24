declare module 'richtypo-rules-en' {
	type Rule = (text: string) => string;

	export const definitions: {
		closingQuote: string;
		dash: string;
		decimalsSeparator: string;
		emdash: string;
		endash: string;
		hairspace: string;
		letter: string;
		letterOrHyphen: string;
		letterOrQuote: string;
		nbsp: string;
		notInTag: string;
		notLetterOrHyphen: string;
		openingQuote: string;
		ordinal: string;
		preposition: string;
		punctuation: string;
		punctuationOrQuote: string;
		quote: string;
		shortWord: string;
		space: string;
		tag: string;
		thousandsSeparator: string;
		upperLetter: string;
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
