module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				targets: { node: '7' },
			},
		],
	],
	env: {
		local: {
			presets: [
				[
					'@babel/preset-env',
					{
						targets: { node: 'current' },
					},
				],
			],
			plugins: [
				[
					'module-resolver',
					{
						alias: {
							richtypo: './packages/richtypo/src/richtypo.js',
						},
					},
				],
				[
					'transform-react-jsx',
					{
						pragma: 'vdo',
					},
				],
			],
		},
	},
};
