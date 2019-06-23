import nodeExternals from 'webpack-node-externals';

import path from 'path';
import base from './base';

const config = base({target: 'node'});

const outputPath = path.join(config.context, 'dist', 'render');
const entryPath = path.join(config.context, 'src', 'render');

config.externals = [nodeExternals()];

config.entry = [entryPath];

config.output = {
  path: outputPath,
  publicPath: '/',
  filename: '[name].js',
  chunkFilename: '[name].js',
  library: 'render',
  libraryTarget: 'commonjs2',
};

config.optimization = {minimize: false};

export default config;
