describe('RichTypo', function() {
	var rt = require('../richtypo');

	function _symb(s) {
		return s.replace(/_/g, String.fromCharCode(160));
	}	

	it('has API functions', function() {
		expect(rt.lang).toBeDefined();
		expect(rt.lite).toBeDefined();
		expect(rt.rich).toBeDefined();
	});

	it('safe tags', function() {
		expect(rt.rich('<code> -->> </code>'))
			.toBe('<code> -->> </code>');

		expect(rt.rich('<code> а — б </code>'))
			.toBe('<code> а — б </code>');

		expect(rt.rich('А текст внутри тегов <img src="hamster.jpg" alt="а — б"> не надо типографить.'))
			.toBe(_symb('А_текст внутри тегов <img src="hamster.jpg" alt="а — б"> не_надо типографить.'));

		expect(rt.rich('Теперь <b>всё — вместе</b>. А текст внутри тегов <img src="hamster.jpg" alt="а — б"> не надо типографить. И кода кусок:<pre><code>\nа — б\nа — б\nа — б\n</code></pre>.'))
			.toBe(_symb('Теперь <b>всё_— вместе</b>. А_текст внутри тегов <img src="hamster.jpg" alt="а — б"> не_надо типографить. И_кода кусок:<pre><code>\nа — б\nа — б\nа — б\n</code></pre>.'));	
	});	

	it('spaces lite', function() {
		expect(rt.rich('Такса — животное.'))
			.toBe(_symb('Такса_— животное.'));

		expect(rt.rich('Там было много тлонов, тутликов, табачек и т. п. и т. п.'))
			.toBe(_symb('Там было много тлонов, тутликов, табачек и_т._п. и_т._п.'));		
	});

	it('spaces', function() {
		expect(rt.rich('Прочитай § 13 журнала «Такса» № 27, там про тлонов, тутликов, табачек.'))
			.toBe(_symb('Прочитай §_13 журнала «Такса» №_27, там про тлонов, тутликов, табачек.'));

		expect(rt.rich('Приснился однажды В. И. Ленин В. Путину.'))
			.toBe('Приснился однажды <nobr>В. И. Ленин</nobr> <nobr>В. Путину</nobr>.');

		expect(rt.rich('Из-за чего-то всё-таки это как-то очень странно.'))
			.toBe('<nobr>Из-за</nobr> <nobr>чего-то</nobr> всё-таки это <nobr>как-то</nobr> очень странно.');

		expect(rt.rich('За колбасой в магазин пошла такса из резины.'))
			.toBe(_symb('За_колбасой в_магазин пошла такса из_резины.'));

		expect(rt.rich('Это ж как бы колбаса!'))
			.toBe(_symb('Это_ж как_бы колбаса!'));

		expect(rt.rich('Колбаса стоит 23 р. Такса стоит 1000000 $.'))
			.toBe(_symb('Колбаса стоит 23_р. Такса стоит 1000000_$.'));

		expect(rt.rich('Это было в 1927 г.'))
			.toBe(_symb('Это было в_1927_г.'));

		expect(rt.rich('Цири родилась 30 июля.'))
			.toBe(_symb('Цири родилась 30_июля.'));
	});

	it('lite', function() {
		expect(rt.lite('Эх...'))
			.toBe('Эх…');

		expect(rt.lite('Такса -- зверь'))
			.toBe(_symb('Такса_— зверь'));

		expect(rt.lite('Такса - зверь'))
			.toBe(_symb('Такса_— зверь'));

		expect(rt.lite('<p>- Бадыдыщь!</p>'))
			.toBe(_symb('<p>— Бадыдыщь!</p>'));

		expect(rt.lite('- Бадыдыщь!\n- Бадыдыщь!'))
			.toBe('&mdash; Бадыдыщь!\n&mdash; Бадыдыщь!');

		expect(rt.lite('<p>- Бадыдыщь!</p>'))
			.toBe(_symb('<p>— Бадыдыщь!</p>'));
	});

	it('quotes', function() {
		expect(rt.lite('Тут просто "текст в кавычках".'))
			.toBe(_symb('Тут просто «текст в кавычках».'));

		expect(rt.lite('"Текст в кавычках "в кавычках"".'))
			.toBe(_symb('«Текст в кавычках «в кавычках»».'));

		expect(rt.lite('А тут "текст "в кавычках" в кавычках".'))
			.toBe(_symb('А тут «текст «в кавычках» в кавычках».'));

		expect(rt.lite('И "клинический "случай".'))
			.toBe(_symb('И «клинический «случай».'));
	});

});
