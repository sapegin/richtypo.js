const path = require('path');
const fledermaus = require('fledermaus');
const richtypo = require('../../richtypo');

richtypo.lang('en');

const config = {
	base: {
		lang: 'en',
	},
};

const renderMarkdown = fledermaus.createMarkdownRenderer();
const renderTemplate = fledermaus.createTemplateRenderer({
	root: __dirname,
});

let documents = fledermaus.loadSourceFiles(__dirname, ['md'], {
	renderers: {
		md: renderMarkdown,
	},
});

documents = documents.map(function(doc) {
	// Run Richtypo
	doc.pageTitle = richtypo.title(doc.title); // Titles
	doc.content = richtypo.rich(doc.content); // Page content

	// Make non-breaking spaces visible
	doc.pageTitle = doc.pageTitle.replace(/\xa0/g, '&nbsp;');
	doc.content = doc.content.replace(/\xa0/g, '&nbsp;');

	return doc;
});

const pages = fledermaus.generatePages(documents, config, fledermaus.helpers, {
	ect: renderTemplate,
});

fledermaus.savePages(pages, path.resolve(__dirname, '..'));
