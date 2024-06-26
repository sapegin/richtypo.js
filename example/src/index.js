import fs from 'fs-extra';
import path from 'path';
import { globSync } from 'glob';
import richtypo from 'richtypo';
import enRules, { amps as enAmps } from 'richtypo-rules-en';
import frRules, { amps as frAmps } from 'richtypo-rules-fr';
import ruRules from 'richtypo-rules-ru';
// import { template } from './template.js';
console.log('Building the example site...');
const highlight = (text) => text
    .replace(/(&nbsp;|\xA0)/gm, '<span class="rule rule-nbsp" title="Non-breaking space">$1</span>')
    .replace(/(\u202f)/gm, '<span class="rule rule-narrow" title="Narrow space">$1</span>')
    .replace(/([“”«»])/gm, '<span class="rule rule-quote" title="Quote">$1</span>')
    .replace(/(—)/gm, '<span class="rule rule-emdash" title="Em dash">$1</span>');
const rt = {
    index: (x) => richtypo([...enRules, enAmps, highlight], x),
    french: (x) => richtypo([...frRules, frAmps, highlight], x),
    russian: (x) => richtypo([...ruRules, highlight], x),
};
fs.ensureDirSync('dist');
const files = globSync('src/content/*.html');
files.forEach((file) => {
    console.log('👉', file);
    const lang = path.basename(file, '.html');
    const content = fs.readFileSync(file, 'utf8');
    const contentTypo = rt[lang]?.(content) ?? '';
    const html = contentTypo; /*template({
        lang: { french: 'fr', russian: 'ru' }[lang] ?? 'en',
        title: `Richtypo ${lang}`,
        content,
        contentTypo,
    });*/
    fs.writeFileSync(file.replace('src/content', 'dist'), html);
});
console.log('👉 example.css');
fs.writeFileSync('dist/example.css', fs.readFileSync('src/example.css', 'utf8'));
console.log('👉 Done');
