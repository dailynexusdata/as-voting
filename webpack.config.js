const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require('dotenv').config();

const plotIds = [
  'plot-test',
  'plot-test-2',
  'ucsb-as-voting-filled-seats',
  'ucsb-as-voting-org',
  'ucsb-as-voting-program-reaffirm',
  'ucsb-as-voting-faces',
];

const config = {
  entry: './src/site/index.js',
  output: {
    filename: `${process.env.NAME}-bundle.js`,
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      name: process.env.NAME,
      plotIds,
      filename: '../index.html',
      template: 'src/site/index.ejs',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
};

module.exports = () => config;
