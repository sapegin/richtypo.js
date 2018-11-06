import flatten from '@arr/flatten';

const SAVE_TAGS_REGEXPS = [
	/<!(--\[[^\]>]+\]|\[[^\]>]+\]--)>/gim,
	/<!--[\s\S]*?-->/gim,
	/<pre[^>]*>[\s\S]*?<\/pre>/gim,
	/<code[^>]*>[\s\S]*?<\/code>/gim,
	/<style[^>]*>[\s\S]*?<\/style>/gim,
	/<script[^>]*>[\s\S]*?<\/script>/gim,
	/<[a-z/][^>]*>/gim,
];
const RESTORE_TAGS_REGEXPS = /<(\d+)>/g;

const beforeAll = text =>
	// Remove repeated spaces
	text.replace(/ {2,}/gm, ' ');

const afterAll = text =>
	text
		// Convert hairspace to an HTML entity
		.replace(/\xAF/gm, '&#x202f;')
		// Remove double tags, like <abbr><abbr>JS</abbr></abbr>
		.replace(/<(\w+)>(<\1>[^<]+<\/\1>)<\/\1>/g, '$2');

// Replace HTML tags with <0>, <1>, etc.
const saveTags = text => {
	let index = 0;
	const tags = [];

	const save = tag => {
		const replacement = `<${index}>`;
		tags[index] = tag;
		index++;
		return replacement;
	};

	const textWithouTags = SAVE_TAGS_REGEXPS.reduce(
		(processedText, regex) => processedText.replace(regex, save),
		text
	);

	return { text: textWithouTags, tags };
};

const restoreTags = (text, { tags }) =>
	text.replace(RESTORE_TAGS_REGEXPS, (_, index) => tags[index]);

const runAllRules = (text, { rules }) =>
	flatten([rules]).reduce((processedText, rule) => rule(processedText), text);

/**
 * @param {Function[]|Function} rules
 * @param {string} text
 * @returns {string}
 */
function run(rules, text) {
	const { text: textWithouTags, tags } = saveTags(text);
	return [beforeAll, runAllRules, afterAll, restoreTags].reduce(
		(processedText, fn) => fn(processedText, { rules, tags }),
		textWithouTags
	);
}

/**
 * @param {Function[]|Function} rules
 * @param {string} [text]
 * @returns {Function|text}
 */
const richtypo = (rules, text) => {
	if (text) {
		return run(rules, text);
	}

	return text => run(rules, text);
};

export default richtypo;
