declare module 'richtypo-rules-common' {
	type Rule = (text: string) => string;
	type RuleFactory<T extends object> = (options: T) => Rule;

	export const definitions: {
		nbsp: string;
		hairspace: string;
		space: string;
		tag: string;
		quote: string;
		letter: string;
		letterOrHyphen: string;
		notLetterOrHyphen: string;
		upperLetter: string;
		letterOrQuote: string;
		punctuation: string;
		punctuationOrQuote: string;
		endash: string;
		emdash: string;
		dash: string;
		openingQuote: string;
		shortWord: string;
		notInTag: string;
	};

	/** Adds non-breaking spaces after short words. */
	export const shortWords: Rule;

	/** Adds non-breaking spaces before the last words to avoid orphans. */
	export const orphans: Rule;

	/** Adds non-breaking spaces between numbers and the following words. */
	export const numberUnits: Rule;

	/** Adds hair spaces between numbers and the following degree symbols. */
	export const degreeSigns: Rule;

	/** Replaces three consecutive dots with ellipses. */
	export const ellipses: Rule;

	/** Wraps ampersands (&) in <span class="amp"> tags. */
	export const amps: Rule;

	/** Wraps abbreviations in <abbr> tags. */
	export const abbrs: Rule;

	/** Disables whitespace wrapping for short words with hyphens. */
	export const hyphenatedWords: Rule;

	/** Replaces hyphen characters with em dashes and add non-breaking spaces when it makes sense. */
	export const dashesBasic: Rule;

	/** Formats 1st, 2nd, 3rd etc. with <sup> tags. */
	export const numberOrdinalsFactory: RuleFactory<{
		/** Should be a regex array of strings e.g. (st|nd|rd|th). */
		ordinals: string;
	}>;

	/** Formats large and decimal numbers with separators. */
	export const numberSeparatorsFactory: RuleFactory<{
		decimalsSeparator: string;
		thousandsSeparator: string;
	}>;

	/** Replaces dumb quotes with smart typographic quotes. */
	export const quotesFactory: RuleFactory<{
		openingQuote: string;
		closingQuote: string;
	}>;
}
