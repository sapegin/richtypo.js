var expect = require('chai').expect;
var rt = require('../richtypo');

function _symb(s) {
	return s.replace(/_/g, String.fromCharCode(160));
}

describe('RichTypo', function() {

	it('has API functions', function() {
		rt.lang('ru');
		expect(rt.lite('Такса — животное.'))
			.to.eql(_symb('Такса_— животное.'));
	});

	it('has API functions', function() {
		expect(rt.lang).to.be.function;
		expect(rt.lite).to.be.function;
		expect(rt.rich).to.be.function;
	});

	it('safe tags ru', function() {
		rt.lang('ru');

		expect(rt.rich('<code> -->> </code>'))
			.to.eql('<code> -->> </code>');

		expect(rt.rich('<code> а — б </code>'))
			.to.eql('<code> а — б </code>');

		expect(rt.rich('А текст внутри тегов <img src="hamster.jpg" alt="а — б"> не надо типографить.'))
			.to.eql(_symb('А_текст внутри тегов <img src="hamster.jpg" alt="а — б"> не_надо типографить.'));

		expect(rt.rich('Теперь <b>всё — вместе</b>. А текст внутри тегов <img src="hamster.jpg" alt="а — б"> не надо типографить. И кода кусок:<pre><code>\nа — б\nа — б\nа — б\n</code></pre>.'))
			.to.eql(_symb('Теперь <b>всё_— вместе</b>. А_текст внутри тегов <img src="hamster.jpg" alt="а — б"> не_надо типографить. И_кода кусок:<pre><code>\nа — б\nа — б\nа — б\n</code></pre>.'));	
	});	

	it('spaces lite ru', function() {
		rt.lang('ru');

		expect(rt.rich('Такса — животное.'))
			.to.eql(_symb('Такса_— животное.'));

		expect(rt.rich('Там было много тлонов, тутликов, табачек и т. п. и т. п.'))
			.to.eql(_symb('Там было много тлонов, тутликов, табачек и_т._п. и_т._п.'));		
	});

	it('spaces ru', function() {
		rt.lang('ru');

		expect(rt.rich('Прочитай § 13 журнала «Такса» № 27, там про тлонов, тутликов, табачек.'))
			.to.eql(_symb('Прочитай §_13 журнала «Такса» №_27, там про тлонов, тутликов, табачек.'));

		expect(rt.rich('Приснился однажды В. И. Ленин В. Путину.'))
			.to.eql('Приснился однажды <nobr>В. И. Ленин</nobr> <nobr>В. Путину</nobr>.');

		expect(rt.rich('Из-за чего-то всё-таки это как-то очень странно.'))
			.to.eql('<nobr>Из-за</nobr> <nobr>чего-то</nobr> всё-таки это <nobr>как-то</nobr> очень странно.');

		expect(rt.rich('За колбасой в магазин пошла такса из резины.'))
			.to.eql(_symb('За_колбасой в_магазин пошла такса из_резины.'));

		expect(rt.rich('Это ж как бы колбаса!'))
			.to.eql(_symb('Это_ж как_бы колбаса!'));

		expect(rt.rich('Колбаса стоит 23 р. Такса стоит 1000000 $.'))
			.to.eql(_symb('Колбаса стоит 23_р. Такса стоит 1000000_$.'));

		expect(rt.rich('Это было в 1927 г.'))
			.to.eql(_symb('Это было в_1927_г.'));

		expect(rt.rich('Цири родилась 30 июля.'))
			.to.eql(_symb('Цири родилась 30_июля.'));
	});

	it('lite ru', function() {
		rt.lang('ru');

		expect(rt.lite('Эх...'))
			.to.eql('Эх…');

		expect(rt.lite('Такса -- зверь'))
			.to.eql(_symb('Такса_— зверь'));

		expect(rt.lite('Такса - зверь'))
			.to.eql(_symb('Такса_— зверь'));

		expect(rt.lite('<p>- Бадыдыщь!</p>'))
			.to.eql(_symb('<p>— Бадыдыщь!</p>'));

		expect(rt.lite('- Бадыдыщь!\n- Бадыдыщь!'))
			.to.eql('&mdash; Бадыдыщь!\n&mdash; Бадыдыщь!');

		expect(rt.lite('<p>- Бадыдыщь!</p>'))
			.to.eql(_symb('<p>— Бадыдыщь!</p>'));
	});

	it('lite en', function() {
		rt.lang('en');

		expect(rt.lite('Yep...'))
			.to.eql('Yep…');

		expect(rt.lite('Dachshund--beast'))
			.to.eql(_symb('<nobr>Dachshund—</nobr>beast'));
	});

	it('quotes ru', function() {
		rt.lang('ru');

		expect(rt.lite('Тут просто "текст в кавычках".'))
			.to.eql('Тут просто «текст в кавычках».');

		expect(rt.lite('"Текст в кавычках "в кавычках"".'))
			.to.eql('«Текст в кавычках «в кавычках»».');

		expect(rt.lite('А тут "текст "в кавычках" в кавычках".'))
			.to.eql('А тут «текст «в кавычках» в кавычках».');

		expect(rt.lite('И "клинический "случай".'))
			.to.eql('И «клинический «случай».');
	});

	it('quotes en', function() {
		rt.lang('en');

		expect(rt.lite('There is a "text in quotes."'))
			.to.eql('There is a “text in quotes.”');

		expect(rt.lite('There is a "text "in quotes" in quotes."'))
			.to.eql('There is a “text “in quotes” in quotes.”');
	});

	it('amps en', function() {
		rt.lang('en');

		expect(rt.title('Dessi &amp; Tsiri'))
			.to.eql('Dessi <span class="amp">&amp;</span> Tsiri');
	});

	it('abbrs ru', function() {
		rt.lang('ru');

		expect(rt.title('На ХХ таксовке ТАКСА было 37 такс'))
			.to.eql(_symb('На_ХХ таксовке <abbr>ТАКСА</abbr> было 37 такс'));
	});

	it('abbrs en', function() {
		rt.lang('en');

		expect(rt.title('On XX dachshund party DOXIE was 37 wieners'))
			.to.eql(_symb('On_XX dachshund party <abbr>DOXIE</abbr> was 37 wieners'));
	});

	it('hanging', function() {
		expect(rt.title('The “quoted text.”'))
			.to.eql(_symb('The<span class="sldquo"> </span> <span class="hldquo">“</span>quoted text.”'));

		expect(rt.title('“Quoted text” two.'))
			.to.eql(_symb('<span class="hldquo">“</span>Quoted text” two.'));

		expect(rt.title('<p>“Quoted text” three.</p>'))
			.to.eql(_symb('<p><span class="hldquo">“</span>Quoted text” three.</p>'));

		expect(rt.title('alert("Hello world!")'))
			.to.eql(_symb('alert("Hello world!")'));
	});	

	it('textify', function() {
		expect(rt.textify(rt.title('The “quoted text.”')))
			.to.eql(_symb('The “quoted text.”'));

		expect(rt.textify(rt.lite('- Бадыдыщь!\n- Бадыдыщь!', 'ru')))
			.to.eql('— Бадыдыщь!\n— Бадыдыщь!');
	});

	it('leaves commented out tags alone', function() {
		expect(rt.lite('<!-- <script>alert("wheee");</script><style>* { color: red; }</style><pre>...</pre> -->'))
			.to.eql('<!-- <script>alert("wheee");</script><style>* { color: red; }</style><pre>...</pre> -->');
	});

	it('plays nice with ie conditional comments', function() {
		expect(rt.title('<!--[if lte IE 6]><script>alert("wheee");</script><style>* { color: red; }</style><pre>...</pre><![endif]-->'))
			.to.eql('<!--[if lte IE 6]><script>alert("wheee");</script><style>* { color: red; }</style><pre>...</pre><![endif]-->');

		expect(rt.title('<!--[if lte IE 6]>The “quoted text.”<![endif]-->'))
			.to.eql('<!--[if lte IE 6]>The<span class="sldquo"> </span> <span class="hldquo">“</span>quoted text.”<![endif]-->');
	});

});
