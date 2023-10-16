import { describe, expect, test } from 'vitest';
import richtypo from './richtypo';

const rule1 = (text: string) => text.replace(/100/g, '%');
const rule2 = (text: string) => text.toUpperCase();
const rule3 = (text: string) => text.replace(/-/g, '#');

const compare = (actual: string, expected: string) =>
	expect(actual.replace(/\xA0/g, '_')).toEqual(expected);

describe('richtypo', () => {
	test('run one rule', () => {
		expect(richtypo(rule1, `changes number 100 with percent`)).toEqual(
			`changes number % with percent`
		);
	});

	test('run rule with empty string', () => {
		expect(richtypo(rule1, '')).toEqual('');
	});

	test('run an array of rules', () => {
		expect(richtypo([rule1, rule2], `changes number 100 with percent`)).toEqual(
			`CHANGES NUMBER % WITH PERCENT`
		);
	});

	test('keep HTML tags', () => {
		compare(
			richtypo(
				rule1,
				'<b>a 100 b</b and an image <img src="pixel.gif" alt="">'
			),
			'<b>a % b</b and an image <img src="pixel.gif" alt="">'
		);
	});

	test('keep HTML tags (code)', () => {
		compare(
			richtypo(rule1, '<code> a 100 b </code>'),
			'<code> a 100 b </code>'
		);
	});

	test('keep HTML tags (pre)', () => {
		compare(richtypo(rule1, '<pre> a 100 b </pre>'), '<pre> a 100 b </pre>');
	});

	test('keep HTML tags (style)', () => {
		compare(
			richtypo(rule1, '<style> a 100 b </style>'),
			'<style> a 100 b </style>'
		);
	});

	test('keep HTML tags (script)', () => {
		compare(
			richtypo(rule1, '<script> a 100 b </script>'),
			'<script> a 100 b </script>'
		);
	});

	test('keep HTML tags (works well with >)', () => {
		compare(richtypo(rule1, '<code> -->> </code>'), '<code> -->> </code>');
	});

	test('keep Markdown images', () => {
		compare(
			richtypo(rule2, '![](/foo.jpg) ![Bar](/bar.jpg)'),
			'![](/foo.jpg) ![BAR](/bar.jpg)'
		);
	});

	test('keep Markdown links', () => {
		compare(
			richtypo(rule2, 'Some [foo bar](/foo) baz.'),
			'SOME [FOO BAR](/foo) BAZ.'
		);
	});

	test('keep Markdown code blocks', () => {
		compare(
			richtypo(rule2, `Some \`and some bar\` foo.`),
			`SOME \`and some bar\` FOO.`
		);
	});

	test('keep Markdown fenced code blocks', () => {
		compare(
			richtypo(
				rule2,
				`Some foo.

\`\`\`bash
npm install --save-dev typings-for-css-modules-loader
\`\`\`
			`
			),
			`SOME FOO.

\`\`\`bash
npm install --save-dev typings-for-css-modules-loader
\`\`\`
			`
		);
	});

	test('keep Markdown fenced code blocks with HTML inside', () => {
		compare(
			richtypo(
				rule2,
				`Some foo.

\`\`\`bash
<p><a href="#">Click here</a> for puppy videos!!</p>
\`\`\`
			`
			),
			`SOME FOO.

\`\`\`bash
<p><a href="#">Click here</a> for puppy videos!!</p>
\`\`\`
			`
		);
	});

	test('keep Markdown fenced code blocks with template literals inside', () => {
		compare(
			richtypo(
				rule2,
				`Some foo.

\`\`\`bash
npm install \`--save-dev\` typings-for-css-modules-loader
\`\`\`
			`
			),
			`SOME FOO.

\`\`\`bash
npm install \`--save-dev\` typings-for-css-modules-loader
\`\`\`
			`
		);
	});

	test('keep Markdown fenced code blocks with something that looks like Markdown links inside', () => {
		compare(
			richtypo(
				rule2,
				`\`\`\`js
const getSpecialOffersForBrand = brand =>
({
  [BRANDS.HORNS_AND_HOOVES]: getHornsAndHoovesSpecialOffers,
  [BRANDS.PAWS_AND_TAILS]: getPawsAndTailsSpecialOffers
}[brand]());
\`\`\``
			),
			`\`\`\`js
const getSpecialOffersForBrand = brand =>
({
  [BRANDS.HORNS_AND_HOOVES]: getHornsAndHoovesSpecialOffers,
  [BRANDS.PAWS_AND_TAILS]: getPawsAndTailsSpecialOffers
}[brand]());
\`\`\``
		);
	});

	test('keep Markdown tables', () => {
		compare(richtypo(rule3, '| - | - |'), '| - | - |');
		compare(richtypo(rule3, '| -- | -- |'), '| -- | -- |');
		compare(richtypo(rule3, '| --- | --- |'), '| --- | --- |');
		compare(richtypo(rule3, '| :- | -: |'), '| :- | -: |');
		compare(richtypo(rule3, '| :-- | --: |'), '| :-- | --: |');
		compare(richtypo(rule3, '| :--- | ---: |'), '| :--- | ---: |');
		compare(
			richtypo(rule3, '| A | B |\n| - | - |\n| a | b |'),
			'| A | B |\n| - | - |\n| a | b |'
		);
		compare(richtypo(rule3, '| `a` | b |'), '| `a` | b |');
	});

	test('rules don’t affect text inside HTML tags', () => {
		compare(
			richtypo(
				rule1,
				'No typo <img src="hamster.jpg" alt="a 100 b"> inside tags.'
			),
			'No typo <img src="hamster.jpg" alt="a 100 b"> inside tags.'
		);
	});

	test('rules don’t affect text inside HTML tags (complex example)', () => {
		compare(
			richtypo(
				rule1,
				'More <b>a 100 b</b>. No typo <img src="hamster.jpg" alt="a 100 b"> inside tags. And some code: <pre><code>\na 100 b\na 100 b\na 100 b\n</code></pre>.'
			),
			'More <b>a % b</b>. No typo <img src="hamster.jpg" alt="a 100 b"> inside tags. And some code: <pre><code>\na 100 b\na 100 b\na 100 b\n</code></pre>.'
		);
	});

	test('leave commented out tags alone', () => {
		compare(
			richtypo(
				rule1,
				'<!-- <script>alert("wheee");</script><style>* { color: red; }</style><pre>...</pre> -->'
			),
			'<!-- <script>alert("wheee");</script><style>* { color: red; }</style><pre>...</pre> -->'
		);
	});

	test('plays nice with IE conditional comments', () => {
		compare(
			richtypo(
				rule1,
				'<!--[if lte IE 6]><script>alert("wheee");</script><style>* { color: red; }</style><pre>...</pre><![endif]-->'
			),
			'<!--[if lte IE 6]><script>alert("wheee");</script><style>* { color: red; }</style><pre>...</pre><![endif]-->'
		);
		compare(
			richtypo(rule1, '<!--[if lte IE 6]>The “quoted text.”<![endif]-->'),
			'<!--[if lte IE 6]>The “quoted text.”<![endif]-->'
		);
	});

	test('remove repeated spaces from the source', () => {
		expect(richtypo(rule1, `changes   number 100  with percent`)).toEqual(
			`changes number % with percent`
		);
	});

	test('remove double tags', () => {
		expect(
			richtypo(
				(s) => s.replace(/100/, '<abbr><abbr>%</abbr></abbr>'),
				`changes number 100 with a tag`
			)
		).toEqual(`changes number <abbr>%</abbr> with a tag`);
	});
});
