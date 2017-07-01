// @ts-check
'use strict';

const rt = require('../richtypo');

function compare(actual, expected) {
	expect(actual.replace(/\xA0/g, '_')).toEqual(expected);
}

describe('RichTypo', () => {
	it('has API functions', () => {
		expect(rt.lang).toEqual(expect.any(Function));
		expect(rt.verbose).toEqual(expect.any(Function));
		expect(rt.lite).toEqual(expect.any(Function));
		expect(rt.rich).toEqual(expect.any(Function));
		expect(rt.full).toEqual(expect.any(Function));
		expect(rt.textify).toEqual(expect.any(Function));
		expect(rt.richtypo).toEqual(expect.any(Function));
	});

	it('safe tags ru', () => {
		rt.lang('ru');

		compare(rt.rich('<code> -->> </code>'), '<code> -->> </code>');

		compare(rt.rich('<code> а — б </code>'), '<code> а — б </code>');

		compare(
			rt.rich('А текст внутри тегов <img src="hamster.jpg" alt="а — б"> не надо типографить.'),
			'А_текст внутри тегов <img src="hamster.jpg" alt="а — б"> не_надо типографить.'
		);

		compare(
			rt.rich(
				'Теперь <b>всё — вместе</b>. А текст внутри тегов <img src="hamster.jpg" alt="а — б"> не надо типографить. И кода кусок:<pre><code>\nа — б\nа — б\nа — б\n</code></pre>.'
			),
			'Теперь <b>всё_— вместе</b>. А_текст внутри тегов <img src="hamster.jpg" alt="а — б"> не_надо типографить. И_кода кусок:<pre><code>\nа — б\nа — б\nа — б\n</code></pre>.'
		);
	});

	it('spaces lite ru', () => {
		rt.lang('ru');

		compare(
			rt.rich('Там было много тлонов, тутликов, табачек и т. д. и т. п.'),
			'Там было много тлонов, тутликов, табачек и_т._д. и_т._п.'
		);
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

	it('lite ru', () => {
		rt.lang('ru');

		compare(rt.lite('Эх...'), 'Эх…');

		compare(rt.lite('Такса -- зверь'), 'Такса_— зверь');

		compare(rt.lite('Такса - зверь'), 'Такса_— зверь');

		compare(rt.lite('<p>- Бадыдыщь!</p>'), '<p>— Бадыдыщь!</p>');

		compare(rt.lite('- Бадыдыщь!\n- Бадыдыщь!'), '&mdash; Бадыдыщь!\n&mdash; Бадыдыщь!');

		compare(rt.lite('<p>- Бадыдыщь!</p>'), '<p>— Бадыдыщь!</p>');
	});

	it('lite en', () => {
		rt.lang('en');

		compare(rt.lite('Yep...'), 'Yep…');

		compare(rt.lite('Dachshund--beast'), '<nobr>Dachshund—</nobr>beast');
	});

	it('emdash ru', () => {
		rt.lang('ru');

		compare(rt.rich('Такса — животное большое.'), 'Такса_— животное_большое.');

		compare(
			rt.rich(
				'— Сколько нужно хипстеров, чтобы заготовить дрова?\n— Два: один будет рубить, второй красиво укладывать.'
			),
			'— Сколько нужно хипстеров, чтобы заготовить дрова?\n— Два: один будет рубить, второй красиво укладывать.'
		);
	});

	it('emdash en', () => {
		rt.lang('en');

		compare(rt.rich('Dachshund — beast.'), '<nobr>Dachshund&#8202;—</nobr>&#8202;beast.');

		compare(rt.rich('Dachshund —'), '<nobr>Dachshund&#8202;—</nobr>');

		compare(rt.rich('— Beast!'), '—&#8202;Beast!');

		compare(rt.rich('Dachshund—beast.'), '<nobr>Dachshund—</nobr>beast.');
	});

	it('quotes ru', () => {
		rt.lang('ru');

		compare(rt.lite('Тут просто "текст в кавычках".'), 'Тут просто «текст в кавычках».');

		compare(rt.lite('"Текст в кавычках "в кавычках"".'), '«Текст в кавычках «в кавычках»».');

		compare(
			rt.lite('А тут "текст "в кавычках" в кавычках".'),
			'А тут «текст «в кавычках» в кавычках».'
		);

		compare(rt.lite('И "клинический "случай".'), 'И «клинический «случай».');
	});

	it('quotes en', () => {
		rt.lang('en');

		compare(rt.lite('There is a "text in quotes."'), 'There is a “text in quotes.”');

		compare(
			rt.lite('There is a "text "in quotes" in quotes."'),
			'There is a “text “in quotes” in quotes.”'
		);

		compare(
			rt.lite('There is a &quot;text &quot;in quotes&quot; in quotes.&quot;'),
			'There is a “text “in quotes” in quotes.”'
		);
	});

	it('amps en', () => {
		rt.lang('en');

		compare(rt.title('Dessi &amp; Tsiri'), 'Dessi <span class="amp">&amp;</span>_Tsiri');
	});

	describe('abbrs ru', () => {
		it('should wrap abbreviations in <abbr>', () => {
			compare(rt.title('таксовке ТАКСА было', 'ru'), 'таксовке <abbr>ТАКСА</abbr>_было');
		});
	});

	describe('abbrs en', () => {
		it('should wrap abbreviations in <abbr>', () => {
			compare(rt.title('party DOXIE was\n', 'en'), 'party <abbr>DOXIE</abbr> was\n');
		});

		it('should not wrap abbreviations in <abbr>', () => {
			compare(rt.title('<abbr>DOXIE</abbr>', 'en'), '<abbr>DOXIE</abbr>');
		});
	});

	it('hanging', () => {
		compare(
			rt.title('The “quoted text.”'),
			'The<span class="sldquo"> </span> <span class="hldquo">“</span>quoted_text.”'
		);

		compare(rt.title('“Quoted text” two.'), '<span class="hldquo">“</span>Quoted text”_two.');

		compare(
			rt.title('<p>“Quoted text” three.</p>'),
			'<p><span class="hldquo">“</span>Quoted text” three.</p>'
		);

		compare(rt.title('alert("Hello world!")'), 'alert("Hello_world!")');

		compare(rt.full('“Quoted text” two.'), '<span class="hldquo">“</span>Quoted text” two.');
	});

	it('textify', () => {
		expect(rt.textify(rt.title('The “quoted text.”')), 'The “quoted text.”');

		expect(rt.textify(rt.lite('- Бадыдыщь!\n- Бадыдыщь!', 'ru')), '— Бадыдыщь!\n— Бадыдыщь!');
	});

	it('leaves commented out tags alone', () => {
		compare(
			rt.lite(
				'<!-- <script>alert("wheee");</script><style>* { color: red; }</style><pre>...</pre> -->'
			),
			'<!-- <script>alert("wheee");</script><style>* { color: red; }</style><pre>...</pre> -->'
		);
	});

	it('plays nice with ie conditional comments', () => {
		compare(
			rt.title(
				'<!--[if lte IE 6]><script>alert("wheee");</script><style>* { color: red; }</style><pre>...</pre><![endif]-->'
			),
			'<!--[if lte IE 6]><script>alert("wheee");</script><style>* { color: red; }</style><pre>...</pre><![endif]-->'
		);

		compare(
			rt.title('<!--[if lte IE 6]>The “quoted text.”<![endif]-->'),
			'<!--[if lte IE 6]>The<span class="sldquo"> </span> <span class="hldquo">“</span>quoted text.”<![endif]-->'
		);
	});
});
