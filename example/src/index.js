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

import richtypo from 'richtypo';
import enRules from 'richtypo-rules-en';
import frRules from 'richtypo-rules-fr';

start('------ Building the page...');

const highlight = text =>
	text
		.replace(
			/(&nbsp;|\xA0)/gm,
			'<span class="rule nbsp" title="non breaking space">$1</span>'
		)
		.replace(
			/(\xAF)/gm,
			'<span class="rule narrow" title="narrow space">$1</span>'
		)
		.replace(/([“”«»])/gm, '<span class="rule quotes" title="quotes">$1</span>')
		.replace(/(—)/gm, '<span class="rule emdash" title="dash">$1</span>');

const rt = {
	uk: richtypo([enRules, highlight]),
	fr: richtypo([frRules, highlight]),
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
