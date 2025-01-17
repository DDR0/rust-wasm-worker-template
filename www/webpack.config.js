const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const dist = path.resolve(__dirname, "dist");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const appConfig = {
	entry: "./app/main.mjs",
	devtool: "cheap-source-map",
	devServer: {
		contentBase: dist,
		headers: {
			"Cross-Origin-Opener-Policy": "same-origin",
			"Cross-Origin-Embedder-Policy": "require-corp",
		},
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "index.html",
			inject: "head",
			scriptLoading: "defer",
		}),
		new MiniCssExtractPlugin(),
	],
	resolve: {
		extensions: [".js", ".mjs"]
	},
	output: {
		path: dist,
		filename: "app.js"
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader'
				]
			},{
				//note: untested, no svgs yet.
				test: /\.svg$/,
				use: 'file-loader'
			}
		]
	}
};

const workerConfig = {
	entry: "./worker/worker.js",
	target: "webworker",
	devtool: "cheap-source-map",
	plugins: [
		new WasmPackPlugin({
			crateDirectory: path.resolve(__dirname, "../crate-wasm")
		})
	],
	resolve: {
		extensions: [".js", ".wasm"]
	},
	output: {
		path: dist,
		filename: "worker.js"
	},
	experiments: {
		//[DDR 2020-11-20] asyncWebAssembly is broken by webpack 5.
		//(See https://github.com/rustwasm/wasm-bindgen/issues/2343)
		syncWebAssembly: true
	}
};

module.exports = [appConfig, workerConfig];
