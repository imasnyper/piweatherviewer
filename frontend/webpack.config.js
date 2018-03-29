const path = require('path');

module.exports = {
	entry: {
		'home.js': './src/home/home.js',
		'history.js': './src/history/history.js',
		'gallery.js': './src/gallery/gallery.js',
	},
	output: {
		filename: '[name]',
		path: path.resolve(__dirname, '../viewer/static/viewer/js')
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
			},
			{
				test: /\.css$/,
				use: {
					loader: 'css-loader'
				}
			}
		],
	},
	mode: "development"
};