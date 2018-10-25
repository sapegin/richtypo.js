import path from 'path';
import {
  start,
  loadSourceFiles,
  generatePages,
  savePages,
  createMarkdownRenderer,
  createTemplateRenderer,
  helpers
} from 'fledermaus';

import richtypo from '../../src/richtypo';
import ukRuleset from '../../packages/uk/src/uk';
import frenchRuleset from '../../packages/french/src/french';

function decorateRules(ruleset) {
  const transformedRules = {};
  Object.entries(ruleset).forEach(([name, rules]) => {
    transformedRules[name] = rules.map(([search, replace]) => [
      search,
      `<span class="rule ${name}" title="${name}">${replace}</span>`
    ]);
  });

  return transformedRules;
}

const rt = {
  uk: richtypo(decorateRules(ukRuleset)),
  fr: richtypo(decorateRules(frenchRuleset))
};

const config = { base: { lang: 'en' } };

start('Building the page...');

const renderMarkdown = createMarkdownRenderer();
const renderTemplate = createTemplateRenderer({ root: __dirname });

let documents = loadSourceFiles(__dirname, ['md'], {
  renderers: { md: renderMarkdown }
});

documents = documents.map(doc => ({
  ...doc,
  pageTitle: rt[doc.language].all(doc.title).html(),
  richtypo: rt[doc.language].all(doc.content).html(),
  content: doc.content // Page content
}));

const pages = generatePages(documents, config.base, helpers, {
  jsx: renderTemplate
});

savePages(pages, path.resolve(__dirname, '../build'));
