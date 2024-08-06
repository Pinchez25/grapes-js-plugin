const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const fs = require('fs');
const pkg = require('./package.json');
const name = pkg.name;
let plugins = [];

module.exports = (env = {}) => {
  const isProduction = env.production;

  if (isProduction) {
    plugins = [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_console: true, // Optionally remove console logs
        },
        output: {
          comments: false,
        },
        sourceMap: true, // Ensure source maps are generated for easier debugging
      }),
      new webpack.BannerPlugin({
        banner: `${name} - ${pkg.version}`,
      }),
    ];
  } else {
    const index = 'index.html';
    const indexDev = '_' + index;
    plugins.push(new HtmlWebpackPlugin({
      template: fs.existsSync(indexDev) ? indexDev : index,
    }));
  }

  return {
    entry: './src',
    output: {
      filename: `./dist/${name}.min.js`,
      library: name,
      libraryTarget: 'umd',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules\/@ckeditor/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-transform-object-rest-spread'],
            },
          },
        },
      ],
    },
    externals: { 'grapesjs': 'grapesjs' },
    plugins: plugins,
  };
};
