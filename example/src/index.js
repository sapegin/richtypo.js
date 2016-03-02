var path = require('path');
var fledermaus = require('fledermaus');
var richtypo = require('../../richtypo');

richtypo.lang('en');

var config = {
	base: {
		lang: 'en'
	}
};

var renderMarkdown = fledermaus.createMarkdownRenderer();
var renderTemplate = fledermaus.createTemplateRenderer({
	root:__dirname
});

var documents = fledermaus.loadSourceFiles(__dirname, ['md'], {
	renderers: {
		md: renderMarkdown
	}
});

documents = documents.map(function(doc) {
	// Run Richtypo
	doc.pageTitle = richtypo.title(doc.title);  // Titles
	doc.content = richtypo.rich(doc.content);  // Page content
	doc.content = richtypo.richtypo(doc.content, ['hanging']);  // Hanging punctuation

	// Make non-breaking spaces visible
	doc.pageTitle = doc.pageTitle.replace(/ /g, '&nbsp;');
	doc.content = doc.content.replace(/ /g, '&nbsp;');

	return doc;
});

var pages = fledermaus.generatePages(documents, config, fledermaus.helpers, {ect: renderTemplate});

fledermaus.savePages(pages, path.resolve(__dirname, '..'));
