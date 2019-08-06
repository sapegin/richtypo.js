import rt from '../richtypo';

const rule1 = text => text.replace(/100/g, '%');
const rule2 = text => text.toUpperCase();
const rule3 = text => text.replace(/-/g, '#');

const compare = (actual, expected) =>
	expect(actual.replace(/\xA0/g, '_')).toEqual(expected);

describe('rightypo', () => {
	test('run one rule', () => {
		expect(rt(rule1, `changes number 100 with percent`)).toEqual(
			`changes number % with percent`
		);
	});

	test('run curried rule', () => {
		const curried = rt(rule1);
		expect(curried(`changes number 100 with percent`)).toEqual(
			`changes number % with percent`
		);
	});

	test('run an array of rules', () => {
		expect(rt([rule1, rule2], `changes number 100 with percent`)).toEqual(
			`CHANGES NUMBER % WITH PERCENT`
		);
	});

	test('run a nested array of rules', () => {
		expect(rt([rule1, [rule2]], `changes number 100 with percent`)).toEqual(
			`CHANGES NUMBER % WITH PERCENT`
		);
	});

	test('keep HTML tags', () => {
		compare(
			rt(rule1, '<b>a 100 b</b and an image <img src="pixel.gif" alt="">'),
			'<b>a % b</b and an image <img src="pixel.gif" alt="">'
		);
	});

	test('keep HTML tags (code)', () => {
		compare(rt(rule1, '<code> a 100 b </code>'), '<code> a 100 b </code>');
	});

	test('keep HTML tags (pre)', () => {
		compare(rt(rule1, '<pre> a 100 b </pre>'), '<pre> a 100 b </pre>');
	});

	test('keep HTML tags (style)', () => {
		compare(rt(rule1, '<style> a 100 b </style>'), '<style> a 100 b </style>');
	});

	test('keep HTML tags (script)', () => {
		compare(
			rt(rule1, '<script> a 100 b </script>'),
			'<script> a 100 b </script>'
		);
	});

	test('keep HTML tags (works well with >)', () => {
		compare(rt(rule1, '<code> -->> </code>'), '<code> -->> </code>');
	});

	test('keep Markdown images', () => {
		compare(
			rt(rule2, '![](/foo.jpg) ![Bar](/bar.jpg)'),
			'![](/foo.jpg) ![BAR](/bar.jpg)'
		);
	});

	test('keep Markdown links', () => {
		compare(
			rt(rule2, 'Some [foo bar](/foo) baz.'),
			'SOME [FOO BAR](/foo) BAZ.'
		);
	});

	test('keep Markdown code blocks', () => {
		compare(
			rt(rule2, `Some \`and some bar\` foo.`),
			`SOME \`and some bar\` FOO.`
		);
	});

	test('keep Markdown fenced code blocks', () => {
		compare(
			rt(
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
			rt(
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
			rt(
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

	test('keep Markdown tables', () => {
		compare(rt(rule3, '| - | - |'), '| - | - |');
		compare(rt(rule3, '| -- | -- |'), '| -- | -- |');
		compare(rt(rule3, '| --- | --- |'), '| --- | --- |');
		compare(rt(rule3, '| :- | -: |'), '| :- | -: |');
		compare(rt(rule3, '| :-- | --: |'), '| :-- | --: |');
		compare(rt(rule3, '| :--- | ---: |'), '| :--- | ---: |');
		compare(
			rt(rule3, '| A | B |\n| - | - |\n| a | b |'),
			'| A | B |\n| - | - |\n| a | b |'
		);
	});

	test('rules don’t affect text inside HTML tags', () => {
		compare(
			rt(rule1, 'No typo <img src="hamster.jpg" alt="a 100 b"> inside tags.'),
			'No typo <img src="hamster.jpg" alt="a 100 b"> inside tags.'
		);
	});

	test('rules don’t affect text inside HTML tags (complex example)', () => {
		compare(
			rt(
				rule1,
				'More <b>a 100 b</b>. No typo <img src="hamster.jpg" alt="a 100 b"> inside tags. And some code: <pre><code>\na 100 b\na 100 b\na 100 b\n</code></pre>.'
			),
			'More <b>a % b</b>. No typo <img src="hamster.jpg" alt="a 100 b"> inside tags. And some code: <pre><code>\na 100 b\na 100 b\na 100 b\n</code></pre>.'
		);
	});

	test('leave commented out tags alone', () => {
		compare(
			rt(
				rule1,
				'<!-- <script>alert("wheee");</script><style>* { color: red; }</style><pre>...</pre> -->'
			),
			'<!-- <script>alert("wheee");</script><style>* { color: red; }</style><pre>...</pre> -->'
		);
	});

	test('plays nice with IE conditional comments', () => {
		compare(
			rt(
				rule1,
				'<!--[if lte IE 6]><script>alert("wheee");</script><style>* { color: red; }</style><pre>...</pre><![endif]-->'
			),
			'<!--[if lte IE 6]><script>alert("wheee");</script><style>* { color: red; }</style><pre>...</pre><![endif]-->'
		);
		compare(
			rt(rule1, '<!--[if lte IE 6]>The “quoted text.”<![endif]-->', 'en'),
			'<!--[if lte IE 6]>The “quoted text.”<![endif]-->'
		);
	});

	test('remove repeated spaces from the source', () => {
		expect(rt(rule1, `changes   number 100  with percent`)).toEqual(
			`changes number % with percent`
		);
	});

	test('convert hair spaces to HTML entities', () => {
		expect(
			rt(s => s.replace(/100/, '\xAF'), `changes number 100 with a hair space`)
		).toEqual(`changes number &#x202f; with a hair space`);
	});

	test('remove double tags', () => {
		expect(
			rt(
				s => s.replace(/100/, '<abbr><abbr>%</abbr></abbr>'),
				`changes number 100 with a tag`
			)
		).toEqual(`changes number <abbr>%</abbr> with a tag`);
	});
});
