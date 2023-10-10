export type Rule = (text: string) => string;
export type Rules = Rule[] | Rule;

const SAVE_TAGS_REGEXPS = [
	// Markdown tables
	/^\|.*?\|$/gm,
	// Markdown links and images
	/(?<=\])\([^)]+\)/gim,
	// Markdown fenced code blocks
	/```[\s\S]*?```/gim,
	// Markdown code blocks
	/`[^`]+?`/gim,
	/<!(--\[[^\]>]+\]|\[[^\]>]+\]--)>/gim,
	/<!--[\s\S]*?-->/gim,
	/<pre[^>]*>[\s\S]*?<\/pre>/gim,
	/<code[^>]*>[\s\S]*?<\/code>/gim,
	/<style[^>]*>[\s\S]*?<\/style>/gim,
	/<script[^>]*>[\s\S]*?<\/script>/gim,
	/<[a-z/][^>]*>/gim,
];
const RESTORE_TAGS_REGEXPS = /<(\d+)>/g;

const beforeAll = (text: string) =>
	// Remove repeated spaces
	text.replace(/ {2,}/gm, ' ');

const afterAll = (text: string) =>
	text
		// Convert hairspace to an HTML entity
		.replace(/\xAF/gm, '&#x202f;')
		// Remove double tags, like <abbr><abbr>JS</abbr></abbr>
		.replace(/<(\w+)>(<\1>[^<]+<\/\1>)<\/\1>/g, '$2');

// Replace HTML tags with <0>, <1>, etc.
const saveTags = (text: string) => {
	let index = 0;
	const tags: string[] = [];

	const save = (tag: string) => {
		const replacement = `<${index}>`;
		tags[index] = tag;
		index++;
		return replacement;
	};

	const textWithoutTags = SAVE_TAGS_REGEXPS.reduce(
		(processedText, regex) => processedText.replace(regex, save),
		text
	);

	return { text: textWithoutTags, tags };
};

const restoreTags = (text: string, { tags }: { tags: string[] }) =>
	text.replace(
		RESTORE_TAGS_REGEXPS,
		(_, index: number): string => tags[index] ?? ''
	);

const runAllRules = (text: string, { rules }: { rules: Rules }) =>
	[rules].flat(1).reduce((processedText, rule) => rule(processedText), text);

function run(rules: Rules, text: string) {
	const { text: textWithoutTags, tags } = saveTags(text);
	return [beforeAll, runAllRules, restoreTags, afterAll].reduce(
		(processedText, fn) => fn(processedText, { rules, tags }),
		textWithoutTags
	);
}

export default function richtypo(rules: Rules, text: string): string {
	return run(rules, text);
}
