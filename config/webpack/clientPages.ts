import path from 'path';
import webpack from 'webpack';

// @ts-ignore
import PagesPlugin from 'pages-webpack-plugin';

import {RenderModule} from '/render/types';

import clientConfig from './client';
import renderConfig from './render';

const {render} = require(path.join(
  renderConfig.output.path,
  'main.js',
)) as RenderModule;

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
