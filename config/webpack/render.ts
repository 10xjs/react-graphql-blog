import nodeExternals from 'webpack-node-externals';

import path from 'path';
import base from './base';

const baseConfig = base({target: 'node'});

const outputPath = path.join(baseConfig.context || '', 'dist', 'render');
const entryPath = path.join(baseConfig.context || '', 'src', 'render');

const config = {
  ...baseConfig,
  entry: [entryPath],
  externals: [nodeExternals()],
  output: {
    path: outputPath,
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].js',
    library: 'render',
    libraryTarget: 'commonjs2',
  },
  optimization: {minimize: false},
};

export default config;
