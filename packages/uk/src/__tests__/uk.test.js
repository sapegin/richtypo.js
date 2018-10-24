import rules from '../uk';
import richtypo from 'richtypo';

function compare(actual, expected) {
	expect(actual.replace(/\xA0/g, '__').replace(/\xAF/g, '_')).toEqual(expected);
}

const rt = richtypo(rules);

describe('non breaking space', () => {
	it('should add non breaking space before orphans and short words', () => {
		compare(
			rt('spaces', `This is <b>of</b> the hook`),
			`This is__<b>of</b>__the__hook`
		);
	});
});

describe('abbr', () => {
	it('should wrap abbreviations in <abbr>', () => {
		compare(
			rt('abbr', `DOXIE and ONU and DaN`),
			`<abbr>DOXIE</abbr> and <abbr>ONU</abbr> and DaN`
		);
	});
});

describe('amp', () => {
	it('should wrap & in a span', () => {
		compare(
			rt('amp', `Dessi & Tsiri`),
			`Dessi__<span class="amp">&</span>__Tsiri`
		);
	});
});

describe('em-dash', () => {
	it(`should add non breaking spaces before em-dash`, () => {
		compare(
			rt('emdash', `<i>Dachshund</i> - <b>beast</b>.`),
			`<i>Dachshund</i>__— <b>beast</b>.`
		);
		compare(rt('emdash', `Naïve — word.`), `Naïve__— word.`);
		compare(rt('emdash', `“Richtypo” — awesome!`), `“Richtypo”__— awesome!`);
		compare(rt('emdash', `Dachshund—beast.`), `Dachshund__— beast.`);
	});

	it(`should add non breaking spaces after em-dash when the em-dash is starting a line or sentence.`, () => {
		compare(rt('emdash', `- Beast!. - Zombie!`), `—__Beast!. —__Zombie!`);
		compare(
			rt(
				'emdash',
				`- Beast!
- Zombie!`
			),
			`—__Beast!
—__Zombie!`
		);
	});
});

describe('ellipsis', () => {
	it(`should replace '...' with ellipsis …`, () => {
		compare(rt('ellipsis', `Yes... Hello.`), `Yes… Hello.`);
	});
});

describe('numbers', () => {
	it(`should put 1st 2nd 3rd etc in subscript`, () => {
		compare(
			rt('numbers', `1st 2nd 3rd 4th 100th`),
			`1<sup>st</sup> 2<sup>nd</sup> 3<sup>rd</sup> 4<sup>th</sup> 100<sup>th</sup>`
		);
	});
	it(`should add space as number separators`, () => {
		compare(
			rt(
				'numbers',
				`There are 6234689821 people, and their average revenue is 1432.331123 yens`
			),
			`There are 6,234,689,821 people, and their average revenue is 1,432.331123 yens`
		);
	});
});

describe('quotes', () => {
	it(`should change quotes "..." into typo quotes “...”`, () => {
		compare(
			rt('quotes', `This is a "text in quotes"`),
			`This is a “text in quotes”`
		);
		compare(
			rt('quotes', `This is a "texte "with inner text" in quotes"`),
			`This is a “texte “with inner text” in quotes”`
		);
		compare(
			rt('quotes', `This is a "<b>text in quotes with an HTML tag</b>"`),
			`This is a “<b>text in quotes with an HTML tag</b>”`
		);
	});
});
