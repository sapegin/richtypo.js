import rt from 'richtypo';

import recommended, {
	quotes,
	amps,
	numberOrdinals,
	numberSeparators,
} from '../en';

function compare(actual, expected) {
	expect(
		actual
			.replace(/\xA0/g, '__')
			.replace(/&#x202f;/g, '_')
			.replace(/—/g, '=')
	).toEqual(expected);
}

describe('English, recommended rules', () => {
	test('add non-breaking space before orphans', () => {
		compare(
			rt(recommended, `Still don't you think?`),
			`Still don't you__think?`
		);
	});

	test('do not add nbsp before the last word longer than 10 letters', () => {
		compare(
			rt(recommended, 'This was otorhinolaryngological.'),
			'This was otorhinolaryngological.'
		);
	});

	test('add non-breaking space after short words', () => {
		compare(rt(recommended, 'even if I fell off'), 'even if__I__fell__off');
	});

	test('add non-breaking space after prepositions', () => {
		compare(
			rt(recommended, 'off the top of the house'),
			'off the__top of__the__house'
		);
	});

	test('add non-breaking space after short words wrapped in a tag', () => {
		compare(
			rt(recommended, `This is <b>of</b> the hook`),
			`This is__<b>of</b>__the__hook`
		);
	});

	test('wrap words with hyphen in nobr when one part is 1-2 characters', () => {
		compare(
			rt(recommended, 'Lie-Fi e-commerce 75-Jähriger US-Krankenhaus'),
			'<nobr>Lie-Fi</nobr> <nobr>e-commerce</nobr> <nobr>75-Jähriger</nobr> <nobr>US-Krankenhaus</nobr>'
		);
	});

	test('do not wrap words with hyphen in nobr if parts are longer than 2 characters', () => {
		compare(
			rt(recommended, 'Paul-Löbe auto-da-fé and -g -w'),
			'Paul-Löbe auto-da-fé and__-g__-w'
		);
	});

	test('do not replace trailing whitespace with nbsp', () => {
		compare(rt(recommended, 'This was\n'), 'This__was\n');
	});

	test('do not wrap words in nobr twice', () => {
		compare(
			rt(recommended, '<nobr>75-Jähriger</nobr>'),
			'<nobr>75-Jähriger</nobr>'
		);
	});

	test('add non-breaking space between a number and a degree sign', () => {
		compare(
			rt(recommended, `Temperature <b>-30</b> °C? Even -25°C maybe`),
			`Temperature <b>-30</b>_°C? Even -25_°C__maybe`
		);
	});

	test('wrap abbreviations in <abbr>', () => {
		compare(
			rt(recommended, `DOXIE and ONU and DaN`),
			`<abbr>DOXIE</abbr> and__<abbr>ONU</abbr> and__DaN`
		);
	});

	test('add hair spaces before and after a dash', () => {
		compare(
			rt(recommended, `Naïve — is word.`),
			`<nobr>Naïve_=</nobr>_is__word.`
		);
		compare(rt(recommended, `Naïve—word.`), `<nobr>Naïve_=</nobr>_word.`);
	});

	test('replace a hyphen with an em dash', () => {
		compare(
			rt(recommended, `“Richtypo” - is awesome!`),
			`<nobr>“Richtypo”_=</nobr>_is__awesome!`
		);
	});

	test('replace an en dash with an em dash', () => {
		compare(
			rt(recommended, `“Richtypo” – is awesome!`),
			`<nobr>“Richtypo”_=</nobr>_is__awesome!`
		);
	});

	test('replace a hyphen with an em dash between tags', () => {
		compare(
			rt(recommended, `<i>Dachshund</i> - <b>beast</b>.`),
			`<nobr><i>Dachshund</i>_=</nobr>_<b>beast</b>.`
		);
	});

	test('replace two or more hyphens with an em dash', () => {
		compare(
			rt(recommended, `Naïve -- is word.`),
			`<nobr>Naïve_=</nobr>_is__word.`
		);
		compare(rt(recommended, `Naïve---word.`), `<nobr>Naïve_=</nobr>_word.`);
	});

	test('keep words with a hypnen at the end', () => {
		compare(
			rt(recommended, `one- and twotailed dogs`),
			`one- and__twotailed__dogs`
		);
	});

	test('keep negative numbers', () => {
		compare(
			rt(recommended, `−10, −11, *−12*, _−13_, <b>−14</b>, stop`),
			`−10, −11, *−12*, _−13_, <b>−14</b>,__stop`
		);
	});

	test('keep negative numbers (hyphen instead of minus)', () => {
		compare(
			rt(recommended, `-10, -11, *-12*, _-13_, <b>-14</b>, stop`),
			`-10, -11, *-12*, _-13_, <b>-14</b>,__stop`
		);
	});

	test('replace ... with ellipsis …', () => {
		compare(rt(recommended, `Yes...`), `Yes…`);
	});

	test('add a non-breaking space between a number and its unit', () => {
		compare(rt(recommended, `1 kg, 2 m`), `1__kg, 2__m`);
	});

	test('change quotes "..." into typo quotes “...”', () => {
		compare(rt(recommended, `Some "text in quotes"`), `Some “text in__quotes”`);
		compare(
			rt(recommended, `Some "text "with inner text" in quotes"`),
			`Some “text “with inner text” in__quotes”`
		);
		compare(
			rt(recommended, `Some "<b>text in quotes with a tag</b>"`),
			`Some “<b>text in__quotes with a__tag</b>”`
		);
	});

	test('recommended rules', () => {
		compare(
			rt(
				recommended,
				`<p>Down, down, down. There was nothing else to do, so Alice soon began talking again. "Dinah’ll miss me very much to-night, I should think!" (Dinah was the cat.) "I hope they’ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I’m afraid, but you might catch a bat, and that’s very like a mouse, you know. But do cats eat bats, I wonder?" And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, "Do cats eat bats? Do cats eat bats?" and sometimes, "Do bats eat cats?’ for, you see, as she couldn’t answer either question, it didn’t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, "Now, Dinah, tell me the truth: did you ever eat a bat?" when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.</p>`
			),
			`<p>Down, down, down. There was nothing else to__do, so__Alice soon began talking again. “Dinah’ll__miss me__very much <nobr>to-night</nobr>, I__should think!” (Dinah was the__cat.) “I__hope they’ll__remember her saucer of__milk at__tea-time. Dinah my__dear! I__wish you were down here with me! There are no__mice in__the__air, I’m__afraid, but you might catch a__bat, and__that’s__very like a__mouse, you know. But do__cats eat bats, I__wonder?” And__here Alice began to__get rather sleepy, and__went on__saying to__herself, in__a__dreamy sort of__way, “Do__cats eat bats? Do__cats eat bats?” and__sometimes, “Do__bats eat cats?’ for, you see, as__she couldn’t__answer either question, it__didn’t__much matter which way she put it. She felt that she was dozing off, and__had just begun to__dream that she was walking hand in__hand with Dinah, and__saying to__her very earnestly, “Now, Dinah, tell me__the__truth: did you ever eat a__bat?” when suddenly, thump! thump! down she came upon a__heap of__sticks and__dry leaves, and__the__fall was__over.</p>`
		);
		compare(
			rt(
				recommended,
				`Presently she began again. "I wonder if I shall fall right through the earth! How funny it’ll seem to come out among the people that walk with their heads downward! The Antipathies, I think <...> but I shall have to ask them what the name of the country is, you know. Please, Ma’am, is this New Zealand or Australia?" (and she tried to curtsey as she spoke - fancy curtseying as you’re falling through the air! Do you think you could manage it?) "And what an ignorant little girl she’ll think me for asking! No, it’ll never do to ask: perhaps I shall see it written up somewhere."`
			),
			`Presently she began again. “I__wonder if__I__shall fall right through the__earth! How funny it’ll__seem to__come out among the__people that walk with their heads downward! The__Antipathies, I__think <...> but I__shall have to__ask them what the__name of__the__country is, you know. Please, Ma’am, is__this New Zealand or__Australia?” (and__she tried to__curtsey as__she <nobr>spoke_=</nobr>_fancy curtseying as__you’re__falling through the__air! Do__you think you could manage it?) “And__what an__ignorant little girl she’ll__think me__for__asking! No, it’ll__never do__to__ask: perhaps I__shall see it__written up__somewhere.”`
		);
		compare(
			rt(
				recommended,
				`There are 1000 "rules" to enrich your text with RichTypo.`
			),
			`There are 1000 “rules” to__enrich your text with__RichTypo.`
		);
	});
});

describe('English, other rules', () => {
	test('wrap & in a span', () => {
		compare(
			rt(amps, `Dessi & Tsiri`),
			`Dessi__<span class="amp">&</span>__Tsiri`
		);
	});

	test('put 1st 2nd 3rd etc in subscript', () => {
		compare(
			rt(numberOrdinals, `1st 2nd 3rd 4th 100th`),
			`1<sup>st</sup> 2<sup>nd</sup> 3<sup>rd</sup> 4<sup>th</sup> 100<sup>th</sup>`
		);
	});

	test('add space as number separators', () => {
		compare(
			rt(
				numberSeparators,
				`There are <b>6234689821</b> people, revenue is 1432.331123 yens`
			),
			`There are <b>6,234,689,821</b> people, revenue is 1,432.331123 yens`
		);
	});
});

describe('English, examples from Readme', () => {
	test('recommended rules', () => {
		compare(
			rt(
				recommended,
				'The quick brown FOX - weighting 47 kg - jumps over "the lazy dog" on sunny morning...'
			),
			'The__quick brown <nobr><abbr>FOX</abbr>_=</nobr>_weighting 47__<nobr>kg_=</nobr>_jumps over “the__lazy dog” on__sunny__morning…'
		);
	});
	test('selected rules', () => {
		compare(
			rt([quotes, numberSeparators], 'Text "in quotes" - 123456.78'),
			'Text “in quotes” - 123,456.78'
		);
	});
});
