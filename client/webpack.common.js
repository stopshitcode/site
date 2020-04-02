const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
	entry: {
		runtime: './src/runtime.ts',
		'ui-vue': './src/ui-vue.ts',
		'ui-svelte': './src/ui-svelte.ts'
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, '.dist'),
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					loaders: {
						// Since sass-loader (weirdly) has SCSS as its default parse mode, we map
						// the "scss" and "sass" values for the lang attribute to the right configs here.
						// other preprocessors should work out of the box, no loader config like this necessary.
						'scss': 'vue-style-loader!css-loader!sass-loader',
						'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
					}
					// other vue-loader options go here
				}
			},
			{
				/*
				 * Parse Svelte components
				 * See: https://github.com/sveltejs/svelte-loader
				*/
				test: /\.svelte$/,
				exclude: /node_modules/,
				loader: 'svelte-loader',
				options: {
					preprocess: require('svelte-preprocess')({ /* options */ })
				}
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: 'ts-loader',
				options: {
					appendTsSuffixTo: [/\.vue$/],
				}
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]?[hash]'
				}
			},
			{
				// this will apply to both plain `.css` files
				// AND `<style>` blocks in `.vue` files
				test: /\.css$/,
				use: [
					'vue-style-loader',
					'css-loader'
				]
			}
		]
	},
	plugins: [
		new VueLoaderPlugin()
	],
	resolve: {
		extensions: ['.ts', '.js', '.vue', '.svelte', '.json'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js'
		}
	}
};
