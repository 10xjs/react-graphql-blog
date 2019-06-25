import path from 'path';
import webpack from 'webpack';

// @ts-ignore
import PagesPlugin from 'pages-webpack-plugin';

import {Render} from '/render/types';

import clientConfig from './client';

const render = require(path.join(
  clientConfig.context || '',
  'dist',
  'render',
  'main.js',
)).default as Render;

const config = {
  ...clientConfig,
  plugins: [
    ...(clientConfig.plugins || []),

    new PagesPlugin({
      paths: ['/', '/404.html'],
      mapStatsToProps: (stats: webpack.Stats) => ({
        stats: stats.toJson({
          source: false,
          chunks: false,
          modules: false,
          entrypoints: false,
          excludeAssets: (name) => /\.hot-update\./.test(name),
        }),
      }),
      render,
      mapResults(results: any[]) {
        return results.map((result) => {
          return {
            ...result,
            filename: result.filename.replace(/\/index.html$/, '.html'),
          };
        });
      },
    }),
  ],
};

export default config;
