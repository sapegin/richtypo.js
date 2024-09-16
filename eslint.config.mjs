import tamiaTypeScript from 'eslint-config-tamia/typescript';

export default [
	...tamiaTypeScript,
	{
		ignores: ['coverage/*', 'dist/*'],
	},
];
