declare module 'richtypo' {
	type Rule = (text: string) => string;

	function richtypo(rules: Rule | Rule[]): (text: string) => string;
	function richtypo(rules: Rule | Rule[], text: string): string;
	export = richtypo;
}
