var path = require('path');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');

module.exports = [
	{
	    name: 'login_server',
	    entry: path.resolve(__dirname, 'main.js'),
	    target: 'node',
	    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder 
	    output: {
	        path: __dirname,
	        filename: 'app.js',
	    },
	    module: {
		loaders: [
				{
				  test: /\.js$/,
				  loader: 'babel',
				  query: {
				  	presets: [ 'react', 'es2015' ]
				  }
				}
			]
		}
	}
]


