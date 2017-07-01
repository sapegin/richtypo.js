// @ts-check
'use strict';

const rt = require('../richtypo');

function compare(actual, expected) {
	expect(actual.replace(/\xA0/g, '_')).toEqual(expected);
}

describe('RichTypo', () => {
	it('has API functions', () => {
		expect(rt.lang).toEqual(expect.any(Function));
		expect(rt.lite).toEqual(expect.any(Function));
		expect(rt.rich).toEqual(expect.any(Function));
		expect(rt.full).toEqual(expect.any(Function));
		expect(rt.textify).toEqual(expect.any(Function));
		expect(rt.richtypo).toEqual(expect.any(Function));
	});

	describe('safe tags', () => {
		it('should keep HTML tags', () => {
			compare(rt.rich('<code> -->> </code>', 'en'), '<code> -->> </code>');
			compare(rt.rich('<code> а — б </code>', 'ru'), '<code> а — б </code>');
		});

		it('should not enhance typography inside HTML tags', () => {
			compare(
				rt.rich(
					'А текст внутри тегов <img src="hamster.jpg" alt="а — б"> не надо типографить.',
					'ru'
				),
				'А_текст внутри тегов <img src="hamster.jpg" alt="а — б"> не_надо типографить.'
			);
			compare(
				rt.rich(
					'Теперь <b>всё — вместе</b>. А текст внутри тегов <img src="hamster.jpg" alt="а — б"> не надо типографить. И кода кусок:<pre><code>\nа — б\nа — б\nа — б\n</code></pre>.',
					'ru'
				),
				'Теперь <b>всё_— вместе</b>. А_текст внутри тегов <img src="hamster.jpg" alt="а — б"> не_надо типографить. И_кода кусок:<pre><code>\nа — б\nа — б\nа — б\n</code></pre>.'
			);
		});

		it('should leave commented out tags alone', () => {
			compare(
				rt.rich(
					'<!-- <script>alert("wheee");</script><style>* { color: red; }</style><pre>...</pre> -->',
					'en'
				),
				'<!-- <script>alert("wheee");</script><style>* { color: red; }</style><pre>...</pre> -->'
			);
		});

		it('plays nice with ie conditional comments', () => {
			compare(
				rt.title(
					'<!--[if lte IE 6]><script>alert("wheee");</script><style>* { color: red; }</style><pre>...</pre><![endif]-->',
					'en'
				),
				'<!--[if lte IE 6]><script>alert("wheee");</script><style>* { color: red; }</style><pre>...</pre><![endif]-->'
			);
			compare(
				rt.title('<!--[if lte IE 6]>The “quoted text.”<![endif]-->', 'en'),
				'<!--[if lte IE 6]>The<span class="sldquo"> </span> <span class="hldquo">“</span>quoted text.”<![endif]-->'
			);
		});
	});

	describe('spaces lite ru', () => {
		it('should put nbsp inside и т. д. and и т. п.', () => {
			compare(
				rt.rich('Там было много тлонов, тутликов, табачек и т. д. и т. п.', 'ru'),
				'Там было много тлонов, тутликов, табачек и_т._д. и_т._п.'
			);
		});
	});

	describe('spaces ru', () => {
		it('should put nbsp after section and number signs', () => {
			compare(
				rt.rich('Прочитай § 13 журнала «Такса» № 27, там про тлонов, тутликов, табачек.', 'ru'),
				'Прочитай §_13 журнала «Такса» №_27, там про тлонов, тутликов,_табачек.'
			);
		});

		it('should wrap initials with <nobr>', () => {
			compare(
				rt.rich('Приснился однажды В. И. Ленин В. Путину.', 'ru'),
				'Приснился однажды <nobr>В. И. Ленин</nobr> <nobr>В._Путину</nobr>.'
			);
		});

		it('should wrap words with hyphen in nobr when one part is 1-2 characters', () => {
			compare(
				rt.rich('Из-за чего-то всё-таки это как-то очень странно.', 'ru'),
				'<nobr>Из-за</nobr> <nobr>чего-то</nobr> всё-таки это <nobr>как-то</nobr> очень_странно.'
			);
		});

		it('should add nbsp after short words', () => {
			compare(
				rt.rich('За колбасой в магазин пошла такса из резины.', 'ru'),
				'За_колбасой в_магазин пошла такса из_резины.'
			);
			compare(rt.rich('рынка книги, мы к этой цифре', 'ru'), 'рынка книги, мы_к_этой_цифре');
		});

		it('should add nbsp before particles', () => {
			compare(rt.rich('Это ж как бы колбаса!', 'ru'), 'Это_ж как_бы колбаса!');
		});

		it('should add nbsp between number and currency', () => {
			compare(
				rt.rich('Колбаса стоит 23 р. Такса стоит 1000000 $.', 'ru'),
				'Колбаса стоит 23_р. Такса стоит 1000000_$.'
			);
		});

		it('should add nbsp in dates', () => {
			compare(rt.rich('Это было в 1927 г.', 'ru'), 'Это было в_1927_г.');
		});

		it('should add nbsp between number and month', () => {
			compare(rt.rich('Цири родилась 30 июля.', 'ru'), 'Цири родилась 30_июля.');
		});
	});

	describe('spaces en', () => {
		it('should add nbsp after short words', () => {
			compare(rt.rich('even if I fell off', 'en'), 'even if_I_fell_off');
		});

		it('should add nbsp after prepositions', () => {
			compare(rt.rich('off the top of the house', 'en'), 'off the_top of_the_house');
		});

		it('should wrap words with hyphen in nobr when one part is 1-2 characters', () => {
			compare(
				rt.rich('Lie-Fi e-commerce 75-Jähriger US-Krankenhaus', 'en'),
				'<nobr>Lie-Fi</nobr> <nobr>e-commerce</nobr> <nobr>75-Jähriger</nobr> <nobr>US-Krankenhaus</nobr>'
			);
		});

		it('should not wrap words with hyphen in nobr', () => {
			compare(
				rt.rich('Paul-Löbe auto-da-fé ;-) -g --watch', 'en'),
				'Paul-Löbe auto-da-fé ;-) -g_--watch'
			);
		});

		it('should add nbsp before the last word in a paragraph to avoid orphans', () => {
			compare(
				rt.rich('One two three.\n\nFour five six!', 'en'),
				'One two_three.\n\nFour five_six!'
			);
		});

		it('should not add nbsp before the last word longer than 10 letters', () => {
			compare(
				rt.rich('This was otorhinolaryngological.', 'en'),
				'This was otorhinolaryngological.'
			);
		});

		it('should not replace trailing whitespace with nbsp', () => {
			compare(rt.rich('This was\n', 'en'), 'This was\n');
		});

		it('should not wrap words in nobr twice', () => {
			compare(rt.rich('<nobr>75-Jähriger</nobr>', 'en'), '<nobr>75-Jähriger</nobr>');
		});
	});

	describe('lite ru', () => {
		it('should replace ... with ellipsis', () => {
			compare(rt.lite('Эх...', 'ru'), 'Эх…');
		});

		it('should replace -- with em-dash', () => {
			compare(rt.lite('Такса -- зверь', 'ru'), 'Такса_— зверь');
		});

		it('should replace - with spaces around with em-dash', () => {
			compare(rt.lite('Такса - зверь', 'ru'), 'Такса_— зверь');
		});

		it('should replace - in the beginning with em-dash', () => {
			compare(rt.lite('<p>- Бадыдыщь!</p>', 'ru'), '<p>— Бадыдыщь!</p>');
			compare(rt.lite('- Бадыдыщь!\n- Бадыдыщь!', 'ru'), '&mdash; Бадыдыщь!\n&mdash; Бадыдыщь!');
			compare(rt.lite('<p>- Бадыдыщь!</p>', 'ru'), '<p>— Бадыдыщь!</p>');
		});
	});

	describe('lite en', () => {
		it('should replace ... with ellipsis', () => {
			compare(rt.lite('Yep...', 'en'), 'Yep…');
		});

		it('should replace -- with em-dash', () => {
			compare(rt.lite('Dachshund--beast', 'en'), '<nobr>Dachshund&#8202;—</nobr>&#8202;beast');
		});
	});

	describe('emdash ru', () => {
		it('should replace - with spaces around with em-dash', () => {
			compare(rt.rich('Такса — животное большое.', 'ru'), 'Такса_— животное_большое.');
		});

		it('should replace - in the beginning with em-dash', () => {
			compare(
				rt.rich(
					'— Сколько нужно хипстеров, чтобы заготовить дрова?\n— Два: один будет рубить, второй красиво укладывать.',
					'ru'
				),
				'— Сколько нужно хипстеров, чтобы заготовить дрова?\n— Два: один будет рубить, второй красиво укладывать.'
			);
		});
	});

	describe('emdash en', () => {
		it('should add hair-spaces around em-dash', () => {
			compare(rt.rich('Dachshund — beast.', 'en'), '<nobr>Dachshund&#8202;—</nobr>&#8202;beast.');
			compare(rt.rich('Naïve — word.', 'en'), '<nobr>Naïve&#8202;—</nobr>&#8202;word.');
			compare(rt.rich('Dachshund —', 'en'), '<nobr>Dachshund&#8202;—</nobr>');
			compare(rt.rich('Naïve —', 'en'), '<nobr>Naïve&#8202;—</nobr>');
			compare(rt.rich('— Beast!', 'en'), '—&#8202;Beast!');
			compare(rt.rich('— Naïve!', 'en'), '—&#8202;Naïve!');
			compare(rt.rich('Dachshund—beast.', 'en'), '<nobr>Dachshund&#8202;—</nobr>&#8202;beast.');
			compare(rt.rich('Naïve—word.', 'en'), '<nobr>Naïve&#8202;—</nobr>&#8202;word.');
		});
	});

	describe('quotes ru', () => {
		it('should replace "" with «»', () => {
			compare(rt.lite('Тут просто "текст в кавычках".', 'ru'), 'Тут просто «текст в кавычках».');
			compare(
				rt.lite('"Текст в кавычках "в кавычках"".', 'ru'),
				'«Текст в кавычках «в кавычках»».'
			);
			compare(
				rt.lite('А тут "текст "в кавычках" в кавычках".', 'ru'),
				'А тут «текст «в кавычках» в кавычках».'
			);
			compare(rt.lite('И "клинический "случай".', 'ru'), 'И «клинический «случай».');
		});
	});

	describe('quotes en', () => {
		it('should replace "" with “”', () => {
			compare(rt.lite('There is a "text in quotes."', 'en'), 'There is a “text in quotes.”');
			compare(
				rt.lite('There is a "text "in quotes" in quotes."', 'en'),
				'There is a “text “in quotes” in quotes.”'
			);
			compare(
				rt.lite('There is a &quot;text &quot;in quotes&quot; in quotes.&quot;', 'en'),
				'There is a “text “in quotes” in quotes.”'
			);
		});
	});

	describe('amps en', () => {
		it('should wrap & in an span', () => {
			compare(rt.title('Dessi &amp; Tsiri', 'en'), 'Dessi <span class="amp">&amp;</span>_Tsiri');
		});
	});

	describe('abbrs ru', () => {
		it('should wrap abbreviations in <abbr>', () => {
			compare(rt.title('таксовке ТАКСА было', 'ru'), 'таксовке <abbr>ТАКСА</abbr>_было');
		});
	});

	describe('abbrs en', () => {
		it('should wrap abbreviations in <abbr>', () => {
			compare(rt.title('DOXIE ÖVP\n', 'en'), '<abbr>DOXIE</abbr> <abbr>ÖVP</abbr>\n');
		});

		it('should not wrap abbreviations in <abbr>', () => {
			compare(rt.title('<abbr>DOXIE</abbr>', 'en'), '<abbr>DOXIE</abbr>');
		});
	});

	describe('hanging punctuation', () => {
		it('should wrap quotes in spans', () => {
			compare(
				rt.title('The “quoted text.”', 'en'),
				'The<span class="sldquo"> </span> <span class="hldquo">“</span>quoted_text.”'
			);
			compare(
				rt.title('“Quoted text” two.', 'en'),
				'<span class="hldquo">“</span>Quoted text”_two.'
			);
			compare(
				rt.title('<p>“Quoted text” three.</p>', 'en'),
				'<p><span class="hldquo">“</span>Quoted text” three.</p>'
			);
			compare(rt.title('alert("Hello world!")', 'en'), 'alert("Hello_world!")');
			compare(
				rt.full('“Quoted text” two.', 'en'),
				'<span class="hldquo">“</span>Quoted text” two.'
			);
		});
	});

	describe('textify', () => {
		it('remove HTML tags from text', () => {
			compare(rt.textify(rt.title('The “quoted text.”', 'en')), 'The “quoted_text.”');
			compare(rt.textify(rt.lite('- Бадыдыщь!\n- Бадыдыщь!', 'ru')), '— Бадыдыщь!\n— Бадыдыщь!');
		});
	});
});
