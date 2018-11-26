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
import enRules, { amps as enAmps } from 'richtypo-rules-en';
import frRules, { amps as frAmps } from 'richtypo-rules-fr';
import ruRules from 'richtypo-rules-ru';

start('Building the example site...');

const highlight = text =>
	text
		.replace(
			/(&nbsp;|\xA0)/gm,
			'<span class="rule rule-nbsp" title="Non-breaking space">$1</span>'
		)
		.replace(
			/(\xAF)/gm,
			'<span class="rule rule-narrow" title="Narrow space">$1</span>'
		)
		.replace(
			/([“”«»])/gm,
			'<span class="rule rule-quote" title="Quote">$1</span>'
		)
		.replace(
			/(—)/gm,
			'<span class="rule rule-emdash" title="Em dash">$1</span>'
		);

const rt = {
	en: richtypo([enRules, enAmps, highlight]),
	fr: richtypo([frRules, frAmps, highlight]),
	ru: richtypo([ruRules, highlight]),
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
