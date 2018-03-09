const path = require('path');

console.log(path.resolve(__dirname, 'dist'));

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, '../viewer/static/viewer')
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['babel-preset-env', 'react']
					}
				}
			}
		]
	},
	mode: "development"
};