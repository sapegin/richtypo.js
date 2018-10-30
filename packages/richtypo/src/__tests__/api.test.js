import rt from '../richtypo';

const mockFunction = text => text.toUpperCase();
const mockFactory = replacement => text =>
	text.replace(new RegExp(replacement, 'gmi'), '_');
const mockRule = mockFactory('\\d');

describe('api test', () => {
	it('should run the fake rule that changes numbers with underscores', () => {
		expect(rt(mockRule, `changes number 100 with underscores`)).toEqual(
			`changes number ___ with underscores`
		);
	});
	it('should run the curried fake rule that changes numbers with underscores', () => {
		const curriedMockRule = rt(mockRule);
		expect(curriedMockRule(`changes number 100 with underscores`)).toEqual(
			`changes number ___ with underscores`
		);
	});
	it('should run the mock function that changes the text in uppercase', () => {
		expect(rt(mockFunction, `changes this sentence in uppercase`)).toEqual(
			`CHANGES THIS SENTENCE IN UPPERCASE`
		);
	});
	it('should run both the mock rule and mock function', () => {
		expect(
			rt([mockRule, mockFunction], `changes number 100 with underscores`)
		).toEqual(`CHANGES NUMBER ___ WITH UNDERSCORES`);
	});
	it('should run both the mock function and mock rule', () => {
		expect(
			rt([mockFunction, [mockRule]], `changes number 100 with underscores`)
		).toEqual(`CHANGES NUMBER ___ WITH UNDERSCORES`);
	});
});
