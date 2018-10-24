import rules from '../french';
import richtypo from 'richtypo';

function compare(actual, expected) {
	expect(actual.replace(/\xA0/g, '__').replace(/\xAF/g, '_')).toEqual(expected);
}

const rt = richtypo(rules);

describe('thin space', () => {
	it(`should add thin space before punctuation and quotes`, () => {
		compare(
			rt(
				'thinSpace',
				`Ceci <span>est</span> un &agrave; <b>texte</b>: avec; «de la» ponctuation<b> !</b> ou sans ?`
			),
			`Ceci <span>est</span> un &agrave; <b>texte</b>_: avec_; «_de la_» ponctuation<b>_!</b> ou sans_?`
		);
	});
});

describe('quotes', () => {
	it(`should change quotes "..." into French quotes «...»`, () => {
		compare(
			rt('quotes', `Ceci est un "texte entre guillemets"`),
			`Ceci est un «texte entre guillemets»`
		);
		compare(
			rt('quotes', `Ceci est un "texte "doublement entre" guillemets"`),
			`Ceci est un «texte «doublement entre» guillemets»`
		);
		compare(
			rt(
				'quotes',
				`Ceci est un "<b>texte entre guillemets avec des tags HTML</b>"`
			),
			`Ceci est un «<b>texte entre guillemets avec des tags HTML</b>»`
		);
	});
});

describe('numbers', () => {
	it(`should put 1er 2ème 3ème in subscript`, () => {
		compare(
			rt('numbers', `1er 2ème ou 2nd 1ères 100èmes`),
			`1<sup>er</sup> 2<sup>ème</sup> ou 2<sup>nd</sup> 1<sup>ères</sup> 100<sup>èmes</sup>`
		);
	});
	it(`should add space as number separators`, () => {
		compare(
			rt(
				'numbers',
				`Il y a 6234689821 habitants, et leur revenu moyen est 1432,331123 yens`
			),
			`Il y a 6__234__689__821 habitants, et leur revenu moyen est 1__432,331123 yens`
		);
	});
});
