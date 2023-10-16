import { describe, expect, test } from 'vitest';
import richtypo from 'richtypo';
import recommended, {
	quotes,
	punctuationMarks,
	numberOrdinals,
	numberSeparators,
} from './fr';

function compare(actual: string, expected: string) {
	expect(
		actual
			.replace(/\xA0/g, '__')
			.replace(/\u202f/g, '_')
			.replace(/—/g, '---')
	).toEqual(expected);
}

describe('punctuation spaces', () => {
	test(`should add thin space before punctuation and quotes`, () => {
		compare(
			richtypo(
				punctuationMarks,
				`Ceci est ? un &agrave; <b>texte secondaire</b>: avec; <i>«de la»</i> ponctuation<b> !</b> ou sans ?`
			),
			`Ceci est_? un &agrave; <b>texte secondaire</b>_: avec_; <i>«_de la_»</i> ponctuation<b>_!</b> ou sans_?`
		);
		compare(
			richtypo(
				punctuationMarks,
				`Alice, assise auprès de sa sœur sur le gazon, commençait à s’ennuyer de rester là à ne rien faire ; une ou deux fois elle avait jeté les yeux sur le livre que lisait sa sœur ; mais quoi ! pas d’images, pas de dialogues ! «La belle avance,» pensait Alice, «qu’un livre sans images, sans causeries !»`
			),
			`Alice, assise auprès de sa sœur sur le gazon, commençait à s’ennuyer de rester là à ne rien faire_; une ou deux fois elle avait jeté les yeux sur le livre que lisait sa sœur_; mais quoi_! pas d’images, pas de dialogues_! «_La belle avance,_» pensait Alice, «_qu’un livre sans images, sans causeries_!_»`
		);
	});
});

describe('quotes', () => {
	test(`should change quotes "..." into French quotes «...»`, () => {
		compare(
			richtypo(quotes, `Ceci est un "texte entre guillemets"`),
			`Ceci est un «texte entre guillemets»`
		);
		compare(
			richtypo(quotes, `Ceci est un "texte "doublement entre" guillemets"`),
			`Ceci est un «texte «doublement entre» guillemets»`
		);
		compare(
			richtypo(
				quotes,
				`Ceci est un "<b>texte entre guillemets avec des tags HTML</b>"`
			),
			`Ceci est un «<b>texte entre guillemets avec des tags HTML</b>»`
		);
	});
});

describe('numbers', () => {
	test(`should put 1er 2ème 3ème in subscript`, () => {
		compare(
			richtypo(numberOrdinals, `1er 2ème ou 2nd 1ères 100èmes`),
			`1<sup>er</sup> 2<sup>ème</sup> ou 2<sup>nd</sup> 1<sup>ères</sup> 100<sup>èmes</sup>`
		);
	});
	test(`should add space as number separators`, () => {
		compare(
			richtypo(
				numberSeparators,
				`Il y a 6234689821 habitants, et leur revenu moyen est 1432,331123 yens`
			),
			`Il y a 6__234__689__821 habitants, et leur revenu moyen est 1__432,331123 yens`
		);
	});
});

describe('recommended rules', () => {
	test(`should execute all rules`, () => {
		compare(
			richtypo(
				recommended,
				`Tombe, tombe, tombe ! - Donc Alice, faute d’avoir rien de mieux à faire, se remit à se parler : "Dinah remarquera mon absence ce soir, bien sûr." (Dinah c’était son chat.) "Pourvu qu’on n’oublie pas de lui donner sa jatte de lait à l’heure du thé. Dinah, ma minette, que n’es-tu ici avec moi ? Il n’y a pas de souris dans les airs, j’en ai bien peur ; mais tu pourrais attraper une chauve-souris, et cela ressemble beaucoup à une souris, tu sais. Mais les chats mangent-ils les chauves-souris ?" Ici le sommeil commença à gagner Alice. Elle répétait, à moitié endormie : "Les chats mangent-ils les chauves-souris ? Les chats mangent-ils les chauves-souris ?" Et quelquefois : "Les chauves-souris mangent-elles les chats ?" Car vous comprenez bien que, puisqu’elle ne pouvait répondre ni à l’une ni à l’autre de ces questions, peu importait la manière de les poser. Elle s’assoupissait et commençait à rêver qu’elle se promenait tenant Dinah par la main, lui disant très sérieusement : "Voyons, Dinah, dis-moi la vérité, as-tu jamais mangé des chauves-souris ?" Quand tout à coup, pouf ! la voilà étendue sur un tas de fagots et de feuilles sèches, - et elle a fini de tomber.`
			),
			`Tombe, tombe, tombe_!__--- Donc Alice, faute d’avoir rien de__mieux à__faire, se__remit à__se__parler_: «_Dinah remarquera mon absence ce__soir, bien sûr._» (Dinah c’était son chat.) «_Pourvu qu’on__n’oublie pas de__lui donner sa__jatte de__lait à__l’heure du__thé. Dinah, ma__minette, que n’es-tu ici avec moi_? Il__n’y__a__pas de__souris dans les airs, j’en__ai__bien peur_; mais tu__pourrais attraper une chauve-souris, et__cela ressemble beaucoup à__une souris, tu__sais. Mais les chats mangent-ils les chauves-souris_?_» Ici le__sommeil commença à__gagner Alice. Elle répétait, à__moitié endormie_: «_Les chats mangent-ils les chauves-souris_? Les chats mangent-ils les chauves-souris_?_» Et__quelquefois_: «_Les chauves-souris mangent-elles les chats_?_» Car vous comprenez bien que, puisqu’elle ne__pouvait répondre ni__à__l’une ni__à__l’autre de__ces questions, peu importait la__manière de__les poser. Elle s’assoupissait et__commençait à__rêver qu’elle se__promenait tenant Dinah par la__main, lui disant très sérieusement_: «_Voyons, Dinah, dis-moi la__vérité, as-tu jamais mangé des chauves-souris_?_» Quand tout à__coup, pouf_! la__voilà étendue sur un__tas de__fagots et__de__feuilles sèches,__--- et__elle a__fini de__tomber.`
		);
		compare(
			richtypo(
				recommended,
				`Un Moby ça ose tout, c’est même à cela qu’on le reconnaît. Audiard aurait kiffé.`
			),
			`Un__Moby ça__ose tout, c’est même à__cela qu’on__le__reconnaît. Audiard aurait__kiffé.`
		);
	});
});
