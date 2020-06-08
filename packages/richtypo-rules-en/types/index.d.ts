declare module 'richtypo-rules-en' {
	type Rule = (text: string) => string;

	function abbrs(text: string): string;
	function amps(text: string): string;
	function dashesAdvanced(text: string): string;
	function dashesBasic(text: string): string;
	function degreeSigns(text: string): string;
	function ellipses(text: string): string;
	function hyphenatedWords(text: string): string;
	function numberOrdinals(text: string): string;
	function numberSeparators(text: string): string;
	function numberUnits(text: string): string;
	function orphans(text: string): string;
	function prepositions(text: string): string;
	function quotes(text: string): string;
	function shortWords(text: string): string;

	type dashes = Rule[];

	type recommended = Rule[];
	export = recommended;
}
