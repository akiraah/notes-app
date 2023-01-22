const serverlessWebpack = require('serverless-webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development',
  entry: serverlessWebpack.lib.entries,
  externals: ['aws-sdk'],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-typescript'],
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '.webpack'),
    filename: '[name].js',
  },
}
