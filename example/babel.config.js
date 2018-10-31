const babelConfig = require('../babel.config');
babelConfig.plugins = babelConfig.plugins || [];

babelConfig.plugins.push([
	'transform-react-jsx',
	{
		pragma: 'vdo',
	},
]);

module.exports = babelConfig;
