import fs from 'fs';
import path from 'path';

import webpack from 'webpack';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import {TsConfigPathsPlugin} from 'awesome-typescript-loader';
import createStyledComponentsTransformer from 'typescript-plugin-styled-components';

const root = fs.realpathSync(process.cwd());

const styledComponentsTransformer = createStyledComponentsTransformer();

const base = (seed: webpack.Configuration) => ({
  ...seed,
  context: root,
  mode: process.env.NODE_ENV !== 'production' ? 'development' : 'production',
  devtool:
    process.env.NODE_ENV !== 'production'
      ? seed.target === 'node'
        ? 'inline-source-map'
        : 'source-map'
      : false,

  module: {
    rules: [
      {
        test: /\.woff2?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
              emitFile: seed.target !== 'node',
            },
          },
        ],
      },
      {
        test: /\.js$/,
        use: {
          loader: require.resolve('source-map-loader'),
        },
        enforce: 'pre',
      },
      {
        test: /\.[tj]sx?$/,
        include: path.resolve(root, 'src'),
        use: {
          loader: require.resolve('awesome-typescript-loader'),
          options: {
            module: 'es6',
            transpileOnly: process.env.NODE_ENV !== 'production',
            getCustomTransformers: () => ({
              before: [styledComponentsTransformer],
            }),
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsConfigPathsPlugin()],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new CleanWebpackPlugin(),
  ],
});

export default base;
