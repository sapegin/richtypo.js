import rt from 'richtypo';

import recommended, { quotes, numberSeparators } from '../ru';

function compare(actual, expected) {
	expect(actual.replace(/\xA0/g, '_').replace(/—/g, '=')).toEqual(expected);
}

describe('Russian, recommended rules', () => {
	test('add non-breaking space inside и т. д. and и т. п.', () => {
		compare(
			rt(recommended, 'собачки и т. д. и т. п.'),
			'собачки и_т._д. и_т._п.'
		);
	});

	test('add non-breaking space after section sign', () => {
		compare(rt(recommended, 'Прочитай § 13 журнала'), 'Прочитай §_13_журнала');
	});

	test('add non-breaking space after number sign', () => {
		compare(rt(recommended, 'Прочитай № 27 журнала'), 'Прочитай №_27_журнала');
	});

	test('add hair space after degree sign', () => {
		compare(rt(recommended, '13 °C'), '13&#x202f;°C');
	});

	test('wrap initials with <nobr>', () => {
		compare(
			rt(recommended, 'Приснился В. И. Ленин В. Путину.'),
			'Приснился <nobr>В. И. Ленин</nobr> <nobr>В._Путину</nobr>.'
		);
	});

	test('wrap words with hyphen in nobr when one part is 1-2 characters', () => {
		compare(
			rt(recommended, 'Из-за чего-то всё-таки это как-то очень странно.'),
			'<nobr>Из-за</nobr> <nobr>чего-то</nobr> всё-таки это <nobr>как-то</nobr> очень_странно.'
		);
	});

	test('add non-breaking space after short words', () => {
		compare(
			rt(recommended, 'За колбасой в магазин пошла такса из резины.'),
			'За_колбасой в_магазин пошла такса из_резины.'
		);
		compare(
			rt(recommended, 'рынка книги, мы к этой цифре'),
			'рынка книги, мы_к_этой_цифре'
		);
	});

	test('add non-breaking space before particles', () => {
		compare(rt(recommended, 'Это ж как бы колбаса!'), 'Это_ж как_бы колбаса!');
	});

	test('add non-breaking space between number and currency', () => {
		compare(
			rt(recommended, 'Колбаса стоит 23 р. Такса стоит 1000000 $.'),
			'Колбаса стоит 23_р. Такса стоит 1000000_$.'
		);
	});

	test('add non-breaking space in dates', () => {
		compare(rt(recommended, 'Это было в 1927 г.'), 'Это было в_1927_г.');
	});

	test('add non-breaking space between number and month', () => {
		compare(
			rt(recommended, 'Цири родилась 30 июля.'),
			'Цири родилась 30_июля.'
		);
	});

	test('replace ... with ellipsis', () => {
		compare(rt(recommended, 'Эх...'), 'Эх…');
	});

	test('replace -- with em dash', () => {
		compare(rt(recommended, '--'), '=');
	});

	test('replace - with spaces around with a non-breaking space and em dash', () => {
		compare(rt(recommended, 'Такса - большой зверь'), 'Такса_= большой_зверь');
	});

	test('replace en dash with spaces around with a non-breaking space and em dash', () => {
		compare(rt(recommended, 'Такса – большой зверь'), 'Такса_= большой_зверь');
	});

	test('replace - in the beginning of a line with em dash', () => {
		compare(
			rt(recommended, '- Бадыдыщь йоу!\n- Бадыдыщь_йоу!'),
			'= Бадыдыщь_йоу!\n= Бадыдыщь_йоу!'
		);
	});

	test('replace - right after the tag with em dash', () => {
		compare(
			rt(recommended, '<p>- Бадыдыщь йоу!</p>'),
			'<p>= Бадыдыщь_йоу!</p>'
		);
	});

	test('add non-braking space between , or ) and a dash', () => {
		compare(rt(recommended, 'Такса,- большой зверь'), 'Такса,_= большой_зверь');
		compare(
			rt(recommended, '(Такса)- большой зверь'),
			'(Такса)_= большой_зверь'
		);
	});

	test('keep words with a dash at the end', () => {
		compare(rt(recommended, 'двух- и трёхпупочные'), 'двух- и_трёхпупочные');
	});

	test('replace "" with «»', () => {
		compare(
			rt(recommended, 'Тут просто "текст в кавычках".'),
			'Тут просто «текст в_кавычках».'
		);
		compare(
			rt(recommended, '"Текст в кавычках "в кавычках"".'),
			'«Текст в_кавычках «в_кавычках»».'
		);
		compare(
			rt(recommended, 'А тут "текст "в кавычках" в кавычках".'),
			'А_тут «текст «в_кавычках» в_кавычках».'
		);
		compare(
			rt(recommended, 'И "клинический "случай" тут.'),
			'И_«клинический «случай»_тут.'
		);
	});

	test('wrap abbreviations in <abbr>', () => {
		compare(
			rt(recommended, 'таксовке ТАКСА было'),
			'таксовке <abbr>ТАКСА</abbr>_было'
		);
	});
});

describe('Russian, other rules', () => {
	test('add thousand separators to number', () => {
		compare(
			rt(numberSeparators, '123456789,00'),
			'123&#x202f;456&#x202f;789,00'
		);
	});
});

describe('Russian, examples from Readme', () => {
	test('recommended rules', () => {
		compare(
			rt(
				recommended,
				'Настругал Папа Карло тысячу БУРАТИН 29 февраля - используйте "Ричтайпо" и ваши уши будут торчать из-за туч.'
			),
			'Настругал Папа Карло тысячу <abbr>БУРАТИН</abbr> 29_февраля_= используйте «Ричтайпо» и_ваши уши будут торчать <nobr>из-за</nobr>_туч.'
		);
	});
	test('selected rules', () => {
		compare(
			rt([quotes, numberSeparators], 'Текст "в кавычках" - 123456,78'),
			'Текст «в кавычках» - 123&#x202f;456,78'
		);
	});
});
