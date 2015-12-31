var expect = require('chai').expect;
var rt = require('../richtypo');

function compare(actual, expected) {
	expect(actual.replace(/\xA0/g, '_')).to.eql(expected);
}

describe('RichTypo', function() {

	it('has API functions', function() {
		rt.lang('ru');
		compare(
			rt.lite('Такса — животное.'),
			'Такса_— животное.'
		);
	});

	it('has API functions', function() {
		expect(rt.lang).to.be.function;
		expect(rt.lite).to.be.function;
		expect(rt.rich).to.be.function;
	});

	it('safe tags ru', function() {
		rt.lang('ru');

		compare(
			rt.rich('<code> -->> </code>'),
			'<code> -->> </code>'
		);

		compare(
			rt.rich('<code> а — б </code>'),
			'<code> а — б </code>'
		);
		
		compare(
			rt.rich('А текст внутри тегов <img src="hamster.jpg" alt="а — б"> не надо типографить.'),
			'А_текст внутри тегов <img src="hamster.jpg" alt="а — б"> не_надо типографить.'
		);

		compare(
			rt.rich('Теперь <b>всё — вместе</b>. А текст внутри тегов <img src="hamster.jpg" alt="а — б"> не надо типографить. И кода кусок:<pre><code>\nа — б\nа — б\nа — б\n</code></pre>.'),
			'Теперь <b>всё_— вместе</b>. А_текст внутри тегов <img src="hamster.jpg" alt="а — б"> не_надо типографить. И_кода кусок:<pre><code>\nа — б\nа — б\nа — б\n</code></pre>.'
		);
	});	

	it('spaces lite ru', function() {
		rt.lang('ru');

		compare(
			rt.rich('Такса — животное.'),
			'Такса_— животное.'
		);

		compare(
			rt.rich('Там было много тлонов, тутликов, табачек и т. п. и т. п.'),
			'Там было много тлонов, тутликов, табачек и_т._п. и_т._п.'
		);
	});

	it('spaces ru', function() {
		rt.lang('ru');

		compare(
			rt.rich('Прочитай § 13 журнала «Такса» № 27, там про тлонов, тутликов, табачек.'),
			'Прочитай §_13 журнала «Такса» №_27, там про тлонов, тутликов, табачек.'
		);

		compare(
			rt.rich('Приснился однажды В. И. Ленин В. Путину.'),
			'Приснился однажды <nobr>В. И. Ленин</nobr> <nobr>В. Путину</nobr>.'
		);

		compare(
			rt.rich('Из-за чего-то всё-таки это как-то очень странно.'),
			'<nobr>Из-за</nobr> <nobr>чего-то</nobr> всё-таки это <nobr>как-то</nobr> очень странно.'
		);

		compare(
			rt.rich('За колбасой в магазин пошла такса из резины.'),
			'За_колбасой в_магазин пошла такса из_резины.'
		);

		compare(
			rt.rich('Это ж как бы колбаса!'),
			'Это_ж как_бы колбаса!'
		);

		compare(
			rt.rich('Колбаса стоит 23 р. Такса стоит 1000000 $.'),
			'Колбаса стоит 23_р. Такса стоит 1000000_$.'
		);

		compare(
			rt.rich('Это было в 1927 г.'),
			'Это было в_1927_г.'
		);

		compare(
			rt.rich('Цири родилась 30 июля.'),
			'Цири родилась 30_июля.'
		);

		//compare(
		//  rt.rich('рынка книги, мы к этой цифре'),
		//	'рынка книги, мы_к_этой цифре'
		// );
	});

	it('lite ru', function() {
		rt.lang('ru');

		compare(
			rt.lite('Эх...'),
			'Эх…'
		);

		compare(
			rt.lite('Такса -- зверь'),
			'Такса_— зверь'
		);

		compare(
			rt.lite('Такса - зверь'),
			'Такса_— зверь'
		);

		compare(
			rt.lite('<p>- Бадыдыщь!</p>'),
			'<p>— Бадыдыщь!</p>'
		);

		compare(
			rt.lite('- Бадыдыщь!\n- Бадыдыщь!'),
			'&mdash; Бадыдыщь!\n&mdash; Бадыдыщь!'
		);

		compare(
			rt.lite('<p>- Бадыдыщь!</p>'),
			'<p>— Бадыдыщь!</p>'
		);
	});

	it('lite en', function() {
		rt.lang('en');

		compare(
			rt.lite('Yep...'),
			'Yep…'
		);

		compare(
			rt.lite('Dachshund--beast'),
			'<nobr>Dachshund—</nobr>beast'
		);
	});

	it('quotes ru', function() {
		rt.lang('ru');

		compare(
			rt.lite('Тут просто "текст в кавычках".'),
			'Тут просто «текст в кавычках».'
		);

		compare(
			rt.lite('"Текст в кавычках "в кавычках"".'),
			'«Текст в кавычках «в кавычках»».'
		);

		compare(
			rt.lite('А тут "текст "в кавычках" в кавычках".'),
			'А тут «текст «в кавычках» в кавычках».'
		);

		compare(
			rt.lite('И "клинический "случай".'),
			'И «клинический «случай».'
		);
	});

	it('quotes en', function() {
		rt.lang('en');

		compare(
			rt.lite('There is a "text in quotes."'),
			'There is a “text in quotes.”'
		);

		compare(
			rt.lite('There is a "text "in quotes" in quotes."'),
			'There is a “text “in quotes” in quotes.”'
		);
	});

	it('amps en', function() {
		rt.lang('en');

		compare(
			rt.title('Dessi &amp; Tsiri'),
			'Dessi <span class="amp">&amp;</span> Tsiri'
		);
	});

	it('abbrs ru', function() {
		rt.lang('ru');

		compare(
			rt.title('На ХХ таксовке ТАКСА было 37 такс'),
			'На_ХХ таксовке <abbr>ТАКСА</abbr> было 37 такс'
		);
	});

	it('abbrs en', function() {
		rt.lang('en');

		compare(
			rt.title('On XX dachshund party DOXIE was 37 wieners'),
			'On_XX dachshund party <abbr>DOXIE</abbr> was 37 wieners'
		);
	});

	it('hanging', function() {
		compare(
			rt.title('The “quoted text.”'),
			'The<span class="sldquo"> </span> <span class="hldquo">“</span>quoted text.”'
		);

		compare(
			rt.title('“Quoted text” two.'),
			'<span class="hldquo">“</span>Quoted text” two.'
		);

		compare(
			rt.title('<p>“Quoted text” three.</p>'),
			'<p><span class="hldquo">“</span>Quoted text” three.</p>'
		);

		compare(
			rt.title('alert("Hello world!")'),
			'alert("Hello world!")'
		);
	});	

	it('textify', function() {
		expect(
			rt.textify(rt.title('The “quoted text.”')),
			'The “quoted text.”'
		);

		expect(
			rt.textify(rt.lite('- Бадыдыщь!\n- Бадыдыщь!', 'ru')),
			'— Бадыдыщь!\n— Бадыдыщь!'
		);
	});

	it('leaves commented out tags alone', function() {
		compare(
			rt.lite('<!-- <script>alert("wheee");</script><style>* { color: red; }</style><pre>...</pre> -->'),
			'<!-- <script>alert("wheee");</script><style>* { color: red; }</style><pre>...</pre> -->'
		);
	});

	it('plays nice with ie conditional comments', function() {
		compare(
			rt.title('<!--[if lte IE 6]><script>alert("wheee");</script><style>* { color: red; }</style><pre>...</pre><![endif]-->'),
			'<!--[if lte IE 6]><script>alert("wheee");</script><style>* { color: red; }</style><pre>...</pre><![endif]-->'
		);

		compare(
			rt.title('<!--[if lte IE 6]>The “quoted text.”<![endif]-->'),
			'<!--[if lte IE 6]>The<span class="sldquo"> </span> <span class="hldquo">“</span>quoted text.”<![endif]-->'
		);
	});

});
