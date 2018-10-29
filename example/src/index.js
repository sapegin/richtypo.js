import path from 'path';
import {
	start,
	loadSourceFiles,
	generatePages,
	savePages,
	createMarkdownRenderer,
	createTemplateRenderer,
	helpers,
} from 'fledermaus';

import richtypo from '../../src/richtypo';
import ukRuleset from '../../packages/uk/src/uk';
import frenchRuleset from '../../packages/french/src/french';

start('------ Building the page...');

// function decorateRules(ruleset) {
// 	const transformedRules = {};
// 	Object.entries(ruleset).forEach(([rulename, rules]) => {
// 		rules = !Array.isArray(rules) ? [rules] : rules;

// 		transformedRules[rulename] = rules.map(({ regex, replace, name }) => {
// 			return {
// 				name,
// 				regex,
// 				replace: `<span class="rule ${name}" title="${name}">${replace}</span>`,
// 			};
// 		});
// 	});

// 	return transformedRules;
}

// console.log('UKRULESET', ukRuleset);

// console.log(
// 	'UK',
// 	ukRuleset.all,
// 	'\n\n DECORATED',
// 	decorateRules(ukRuleset).all
// );

const rt = {
	uk: richtypo(ukRuleset.all),
	fr: richtypo(frenchRuleset.all),
};

const config = { base: { lang: 'en' } };

const renderMarkdown = createMarkdownRenderer();
const renderTemplate = createTemplateRenderer({ root: __dirname });

let documents = loadSourceFiles(__dirname, ['md'], {
	renderers: { md: renderMarkdown },
});

documents = documents.map(doc => {
	return {
		...doc,
		pageTitle: rt[doc.language](doc.title),
		richtypo: rt[doc.language](doc.content),
		content: doc.content, // Page content
	};
});

const pages = generatePages(documents, config.base, helpers, {
	jsx: renderTemplate,
});

savePages(pages, path.resolve(__dirname, '../build'));
