var path = require('path');
var sweet2 = require('sweet2');
var richtypo = require('../../richtypo');

richtypo.lang('en');

var config = {
	base: {
		lang: 'en'
	}
};

var renderMarkdown = sweet2.createMarkdownRenderer();
var renderTemplate = sweet2.createTemplateRenderer({
	root:__dirname
});

var documents = sweet2.loadSourceFiles(__dirname, ['md'], {
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

var pages = sweet2.generatePages(documents, config, sweet2.helpers, {ect: renderTemplate});

sweet2.savePages(pages, path.resolve(__dirname, '..'));
